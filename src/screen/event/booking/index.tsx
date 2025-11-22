import type { IBooking } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { useCallback, useMemo } from "react"
import { ArrowUpDown, MoreHorizontal, Trash2, XCircle } from "lucide-react"

import { BookingTable } from "./bookingTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookingCard } from "./bookingCard"
import { useMediaQuery } from "@uidotdev/usehooks"
import { Route } from "@/routes/app.event.booking.index"
import { useMutation } from "@tanstack/react-query"
import { deleteBooking } from "@/api/booking"
import { toast } from "sonner"
import { updateSchedules } from "@/api/schedules"

export default function BookingPage({ data }: { data: IBooking[] }) {
    const queryClient = Route.useRouteContext().queryClient
    const isMobile = useMediaQuery("(max-width: 768px)")

    const { mutate: deleteBookings } = useMutation({
        mutationFn: async (id: string) => await deleteBooking(id),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["bookings"] });
            const previous = queryClient.getQueryData<{ data: IBooking[] }>(["bookings"]);
            if (previous) {
                queryClient.setQueryData<{ data: IBooking[] }>(["bookings"], {
                    ...previous,
                    data: previous.data.filter((b) => b.id !== id),
                });
            }
            return { previous };
        },

        onError: (_error, _id, context) => {
            toast.error("failed to delete booking");
            // rollback
            if (context?.previous) {
                queryClient.setQueryData(["bookings"], context.previous);
            }
        },
        onSuccess: () => {
            toast.success("Booking successfully deleted");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });

    const { mutate: updateBookings } = useMutation({
        mutationFn: async (id: string) => {
            const formData = new FormData()
            formData.append("status", "CLOSED")
            await updateSchedules(id, formData)
        },
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["bookings"] });

            const previous = queryClient.getQueryData<{ data: IBooking[] }>(["bookings"]);

            if (previous) {
                queryClient.setQueryData<{ data: IBooking[] }>(["bookings"], {
                    ...previous,
                    data: previous.data.map((b) =>
                        b.schedule.id === id
                            ? { ...b, schedule: { ...b.schedule, status: "CLOSED" } }
                            : b
                    ),
                });
            }

            return { previous };
        },
        onError: (_err, _id, ctx) => {
            if (ctx?.previous) queryClient.setQueryData(["bookings"], ctx.previous)
            toast.error("failed to update booking")
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] })
        },
        onSuccess: () => toast.success("Booking successfully updated"),
    })

    const handleDelete = useCallback((id: string) => deleteBookings(id), [deleteBookings])
    const handleClose = useCallback((id: string) => updateBookings(id), [updateBookings])

    const columns = useMemo<ColumnDef<IBooking>[]>(
        () => [
            {
                header: "User",
                accessorKey: "user.fullName",
                cell: ({ row }) => {
                    const user = row.original.user
                    return (
                        <div className="flex items-center gap-3">
                            <img
                                src={user.avatar}
                                alt={user.fullName}
                                className="w-8 h-8 rounded-full"
                            />
                            <div>
                                <div className="font-medium">{user.fullName}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Event Category
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                accessorKey: "schedule.categories.name",
                cell: ({ row }) => {
                    const cat = row.original.schedule.categories
                    return (
                        <Link
                            to="/app/event/categories/update/$catId"
                            params={{ catId: cat.id }}
                            className="flex items-center gap-3"
                        >
                            <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-10 h-10 rounded-md object-cover"
                            />
                            <div>
                                <div className="font-semibold">{cat.name}</div>
                                <div className="text-xs text-gray-500">{cat.location}</div>
                            </div>
                        </Link>
                    )
                },
            },
            {
                header: "Schedule",
                accessorKey: "schedule.dateTime",
                cell: ({ row }) => {
                    const date = new Date(row.original.schedule.dateTime)
                    return (
                        <span>
                            {date.toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}{" "}
                            -{" "}
                            {date.toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    )
                },
            },
            {
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Booking At
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                accessorKey: "bookedAt",
                cell: ({ row }) => {
                    const date = new Date(row.original.bookedAt)
                    return (
                        <div className="text-left font-medium">
                            {date.toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                            <div className="text-muted-foreground text-xs">
                                {date.toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </div>
                        </div>
                    )
                },
            },
            {
                header: "Status",
                accessorKey: "schedule.status",
                cell: ({ row }) => {
                    const status = row.original.schedule.status
                    return (
                        <Badge variant={status === "BOOKED" ? "destructive" : "default"}>
                            {status}
                        </Badge>
                    )
                },
            },
            {
                header: "Aksi",
                accessorKey: "id",
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(row.original.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleClose(row.original.schedule.id)}
                            >
                                <XCircle className="mr-2 h-4 w-4" /> Make Closed
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [handleDelete, handleClose]
    )

    // const isLoading = isDeletePending || isUpdatePending

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Daftar Booking</h1>
            {isMobile ? (
                <div className="grid gap-4">
                    {data.map((item) => (
                        <BookingCard
                            key={item.id}
                            data={item}
                            onDelete={handleDelete}
                            onClose={handleClose}
                        />
                    ))}
                </div>
            ) : (
                <BookingTable columns={columns} data={data} />
            )}
        </div>
    )
}
