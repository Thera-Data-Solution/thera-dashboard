import { Badge } from "@/components/ui/badge";
import type { IUser } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./userDataTable";
import Pagination from "../../../components/pagination";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, CircleMinus, CirclePlus, Loader2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { DisableUser } from "@/api/user";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";

interface showing {
    show: boolean
    user: IUser | null
    type: boolean,
}
export default function ListUser({
    user,
    page,
    totalPages,
    admin = false,
    onPageChange,

}: {
    user: IUser[],
    page: number,
    totalPages: number,
    admin: boolean,
    onPageChange: (page: number) => void
}) {
    const [disableUser, setDisableUser] = useState<showing>({
        show: false,
        user: null,
        type: false
    })
    const columns: ColumnDef<IUser>[] = [
        {
            accessorKey: "avatar",
            header: "Avatar",
            cell: ({ row }) => (
                <Avatar>
                    <AvatarImage src={row.original.avatar || "https://github.com/shadcn.png"} />
                    <AvatarFallback>AV</AvatarFallback>
                </Avatar>
            )
        },
        {
            accessorKey: "fullName",
            header: "Full Name",
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "phone",
            header: "Phone"
        },
        {
            accessorKey: 'ig',
            header: "Instagram"
        },
        {
            accessorKey: "fb",
            header: "Facebook"
        },
        {
            accessorKey: "disable",
            header: "Disable ?",
            cell({ row }) {
                const disable = row.original.disable
                return (
                    <div><Badge variant={disable ? "destructive" : "default"}>{disable ? "disable" : "aktif"}</Badge></div>
                )
            },
        },
        {
            accessorKey: "id",
            header: "Action",
            cell: ({ row }) => {
                const tenant = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                                setDisableUser({
                                    show: true,
                                    user: tenant,
                                    type: tenant.disable
                                })
                            }}
                        >
                            {!tenant.disable ? <CircleMinus /> : <CirclePlus />}
                        </Button>
                    </div>
                );
            },
        },
    ];

    const { mutate, isPending } = useMutation({
        mutationFn: async (id: string) => {
            return await DisableUser(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-users"],
            })
            queryClient.invalidateQueries({
                queryKey: ["users"],
            })
            toast.success("Category deleted successfully");
            setDisableUser({
                show: false,
                user: null,
                type: false
            })
        }
    })

    const adisableUser = (id: string) => {
        mutate(id)
    }

    if (admin) {
        columns.push({
            accessorKey: "tenantName",
            header: "Tenant Name"
        })
    }
    return (
        <div>
            <DataTable
                columns={columns}
                data={user}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />

            <AlertDialog open={disableUser.show} onOpenChange={() => setDisableUser({ show: false, user: null, type: false })}>
                <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {disableUser.type ? "Disable" : "Enable"} <span className="font-bold">{disableUser.user?.fullName}</span> {`(${disableUser.user?.email})`}
                            <br /><br />
                            This action cannot be undone. This will permanently change your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button onClick={() => adisableUser(disableUser.user ? disableUser.user.id : "")}>{isPending ? <Loader2Icon className="animate-spin" /> : "Submit"} </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}