import type { TFooter } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table"
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
// import { useNavigate } from "@tanstack/react-router"
import { Loader2, PlusIcon } from "lucide-react"
import { TooltipContent } from "@radix-ui/react-tooltip"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { useState } from "react"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    useDeleteLink,
    useUpdateLink,
    useCreateLink,
    useOrderUp,
    useOrderDown
} from "./api"

const formSchema = z.object({
    type: z.string(),
    name: z.string().min(1),
    value: z.string().min(1)
});

export default function SocialLink({ data }: { data: TFooter[] }) {
    const [open, setOpen] = useState<boolean>(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const createLink = useCreateLink()
    const updateLinkMutate = useUpdateLink()
    const orderUpMutate = useOrderUp()
    const orderDownMutate = useOrderDown()
    const deleteMutate = useDeleteLink()

    // const navigate = useNavigate()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })

    function handleEdit(item: TFooter) {
        setEditingId(item.id)
        form.reset({
            type: item.type,
            name: item.name,
            value: item.value,
        })
        setOpen(true)
    }

    function handleAdd() {
        setEditingId(null)
        form.reset({ type: "", name: "", value: "" })
        setOpen(true)
    }

    async function onSubmit(values: any) {
        const formData = new FormData()
        formData.append("type", values.type)
        formData.append("name", values.name)
        formData.append("value", values.value)

        try {
            if (editingId) {
                await updateLinkMutate.mutateAsync({ id: editingId, data: formData })
                toast.success("Updated!")
            } else {
                await createLink.mutateAsync(formData)
                toast.success("Created!")
            }

            setOpen(false)
        } catch (err) {
            console.log(err)
            toast.error("Something went wrong!")
        }
    }

    const column: ColumnDef<TFooter>[] = [
        {
            accessorKey: "name",
            header: "Label",
        },
        {
            accessorKey: "value",
            header: "Go To",
        },
        {
            accessorKey: "type",
            header: "Type Link",
        },
        {
            header: "Action",
            cell: ({ row }) => {
                const item = row.original

                return (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => handleEdit(item)}
                        >
                            Edit
                        </Button>

                        {/* ⭐ ORDER UP WITH SPINNER */}
                        <Button
                            variant="outline"
                            disabled={orderUpMutate.isPending}
                            onClick={() => orderUpMutate.mutate(item.id)}
                        >
                            {orderUpMutate.isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                "↑"
                            )}
                        </Button>

                        {/* ⭐ ORDER DOWN WITH SPINNER */}
                        <Button
                            variant="outline"
                            disabled={orderDownMutate.isPending}
                            onClick={() => orderDownMutate.mutate(item.id)}
                        >
                            {orderDownMutate.isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                "↓"
                            )}
                        </Button>

                        {/* DELETE */}
                        <Button
                            variant="destructive"
                            onClick={() => deleteMutate.mutate(item.id)}
                        >
                            Delete
                        </Button>
                    </div>
                )
            },
        },
    ]


    return (
        <div className="container mx-auto py-10">
            <DataTable columns={column} data={data || []} />
            <div className="fixed bottom-6 right-6">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={handleAdd}
                                variant="ghost"
                                size="lg"
                                className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                            >
                                <PlusIcon className="h-8 w-8" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add new social link</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <Drawer open={open} onClose={() => setOpen(false)}>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>New Social Media</DrawerTitle>
                            <DrawerDescription>Make ....</DrawerDescription>
                        </DrawerHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="p-4 pb-0 space-y-8">
                                <Form {...form}>
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type Link</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="social">Social</SelectItem>
                                                        <SelectItem value="about">About Info</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>Type Link</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-12 gap-4">

                                        <div className="col-span-6">

                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Label Social Media</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter label social media"

                                                                type="text"
                                                                {...field} />
                                                        </FormControl>
                                                        <FormDescription>Eg. My Instagram....</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="col-span-6">

                                            <FormField
                                                control={form.control}
                                                name="value"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Url Social Media</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter your url"

                                                                type=""
                                                                {...field} />
                                                        </FormControl>
                                                        <FormDescription>Eg. https://linkedin.com/in/kepsgurih</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </Form>
                            </div>
                            <DrawerFooter>
                                <Button>Submit</Button>
                                <DrawerClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}