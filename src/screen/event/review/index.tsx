import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DataTable } from "@/screen/content/social/data-table"
import type { IReview } from "@/types"
import { type ColumnDef } from "@tanstack/react-table"
import dayjs from 'dayjs'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTestimoni } from "@/api/review"
import { toast } from "sonner"



export default function ShowReview({ data }: { data: IReview[] }) {
    const queryClient = useQueryClient();
    const [openReview, setOpenReview] = useState({
        open: false,
        content: ''
    })

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { showTesti: boolean } }) => updateTestimoni(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            toast.success('Tenant berhasil ditambahkan');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Gagal menambahkan tenant');
        },
    })
    const columns: ColumnDef<IReview>[] = [
        {
            header: 'No',
            accessorKey: 'id',
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "id",
            header: "User",
            cell: ({ row }) => (
                <div className="flex gap-2 items-center">
                    <Avatar>
                        <AvatarImage src={row.original?.user?.avatar || "https://github.com/shadcn.png"} />
                        <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                    <div>
                        <div>{row.original.user?.fullName}</div>
                        <div>{row.original?.user?.email}</div>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "id",
            header: "Event",
            cell: ({ row }) => (
                <div>
                    <div>{row?.original?.schedule?.categories?.name}</div>
                    <div>{dayjs(row?.original?.schedule?.dateTime).format('DD/MM/YYYY HH:mm:ss')}</div>
                </div>
            )
        },
        {
            accessorKey: 'id',
            header: "Review",
            cell: ({ row }) => {
                const testimoni = row.original.testimoni
                if (!testimoni || testimoni === "") return
                else {
                    const words = testimoni.split(/\s+/)
                    return (
                        <div>
                            <Button onClick={() => setOpenReview({
                                open: true,
                                content: testimoni
                            })} variant={'outline'}>{words.slice(0, 5).join(" ") + "..."}</Button>
                        </div>
                    )
                }
            },
        },
        {
            accessorKey: 'id',
            header: '',
            cell: ({ row }) => row.original.testimoni && <Button onClick={() => {
                const payload = {
                    showTesti: !row.original.showTesti,
                }


                mutate({
                    id: row.original.id,
                    data: payload
                })
            }} variant={'link'} className={row.original.showTesti ? "text-red-600" : "text-blue-700"}>{row.original.showTesti ? "Hide" : "Show"}</Button>
        }


    ]

    if (isPending) {
        return (
            <div className="animate-bounce p-20">Wait.....</div>
        )
    }
    return (
        <div>
            <DataTable data={data} columns={columns} />

            <AlertDialog open={openReview.open} onOpenChange={(val) => setOpenReview({ ...openReview, open: val })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Review :</AlertDialogTitle>
                        <AlertDialogDescription>
                            {openReview?.content}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>OK</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}