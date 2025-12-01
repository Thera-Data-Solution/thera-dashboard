import type { ITenant } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "./userDataTable";

import { CircleMinus, PencilIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { useCreateTenant, useDeleteTenant, useUpdateTenant } from "@/hooks/tenantHook";

export default function TenantScreen({ data }: { data: ITenant[] }) {
    const [newOpen, setNewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState<ITenant | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        logo: null as File | null,
    });

    const resetForm = () => {
        setFormData({
            name: "",
            logo: null,
        });
    };

    const createMutation = useCreateTenant();
    const updateMutation = useUpdateTenant();
    const deleteMutation = useDeleteTenant();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append("name", formData.name);
        if (formData.logo) fd.append("logo", formData.logo);

        await createMutation.mutateAsync(fd, {
            onSuccess: () => {
                setNewOpen(false);
                resetForm();
            },
        });
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;

        const fd = new FormData();
        fd.append("name", formData.name);
        if (formData.logo) fd.append("logo", formData.logo);

        await updateMutation.mutateAsync(
            { id: selectedItem.id, data: fd },
            {
                onSuccess: () => {
                    setEditOpen(false);
                    setSelectedItem(null);
                    resetForm();
                },
            }
        );
    };

    const handleDelete = async () => {
        if (!selectedItem) return;

        await deleteMutation.mutateAsync(selectedItem.id, {
            onSuccess: () => {
                setDeleteOpen(false);
                setSelectedItem(null);
            },
        });
    };

    const columns: ColumnDef<ITenant>[] = [
        {
            accessorKey: "logo",
            header: "Logo",
            cell: ({ row }) => (
                <Avatar>
                    <AvatarImage
                        src={row.original.logo || "https://github.com/Thera-Data-Solution.png"}
                    />
                    <AvatarFallback>TN</AvatarFallback>
                </Avatar>
            ),
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => {
                const disable = !row.original.isActive;
                return (
                    <Badge variant={disable ? "destructive" : "default"}>
                        {disable ? "Disable" : "Active"}
                    </Badge>
                );
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
                            size="icon"
                            onClick={() => {
                                setSelectedItem(tenant);
                                setFormData({
                                    name: tenant.name,
                                    logo: null,
                                });
                                setEditOpen(true);
                            }}
                        >
                            <PencilIcon />
                        </Button>

                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                                setSelectedItem(tenant);
                                setDeleteOpen(true);
                            }}
                        >
                            <CircleMinus />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <div className="flex justify-between mb-4">
                <div className="text-xl font-bold">All Tenants</div>

                <Button size="sm" onClick={() => setNewOpen(true)}>
                    <PlusIcon /> New Tenant
                </Button>
            </div>

            <DataTable data={data} columns={columns} />

            {/* CREATE SHEET */}
            <Sheet open={newOpen} onOpenChange={setNewOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Create Tenant</SheetTitle>
                        <SheetDescription>
                            Isi form untuk menambahkan tenant baru.
                        </SheetDescription>
                    </SheetHeader>

                    <form className="grid gap-4 mt-4 mx-4" onSubmit={handleCreate}>
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                placeholder="Nama tenant"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        logo: e.target.files?.[0] || null,
                                    })
                                }
                            />
                        </div>

                        <SheetFooter>
                            <Button type="submit" disabled={createMutation.isPending}>
                                Save
                            </Button>
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            {/* EDIT SHEET */}
            <Sheet open={editOpen} onOpenChange={setEditOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit Tenant</SheetTitle>
                    </SheetHeader>

                    <form className="grid gap-4 mt-4" onSubmit={handleEdit}>
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        logo: e.target.files?.[0] || null,
                                    })
                                }
                            />
                        </div>

                        <SheetFooter>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                Update
                            </Button>
                            <SheetClose asChild>
                                <Button variant="outline">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>

            {/* DELETE SHEET */}
            <Sheet open={deleteOpen} onOpenChange={setDeleteOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Delete Tenant</SheetTitle>
                        <SheetDescription>
                            Yakin ingin menghapus tenant ini?
                        </SheetDescription>
                    </SheetHeader>

                    <SheetFooter>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            Delete
                        </Button>
                        <SheetClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}
