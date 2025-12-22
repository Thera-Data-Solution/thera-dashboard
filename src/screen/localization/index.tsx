import { type FormEvent, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTableArticle } from '@/screen/content/articles/dataTable';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    useCreateTranslation,
    useUpdateTranslation,
    useDeleteTranslation,
    type TranslateItem,
    useTranslations,
    type TranslateFilters,
} from '@/hooks/translateHook.tsx';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function Localization() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TranslateItem | null>(null);
    const [formD, setFormD] = useState({
        locale: '',
        namespace: '',
        key: '',
        value: '',
    });
    const [filters, setFilters] = useState<TranslateFilters>({
        limit: 1000,
        page: 1,
        locale: '',
        namespace: '',
        search: '',
    });

    const { data, isLoading, isError } = useTranslations(filters);

    const createMutation = useCreateTranslation();
    const updateMutation = useUpdateTranslation();
    const deleteMutation = useDeleteTranslation();

    const handleOpenCreate = () => {
        setEditMode(false);
        resetForm();
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (item: TranslateItem) => {
        setEditMode(true);
        setSelectedItem(item);
        setFormD({
            locale: item.locale,
            namespace: item.namespace,
            key: item.key,
            value: item.value,
        });
        setIsDrawerOpen(true);
    };

    const handleOpenDelete = (item: TranslateItem) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (editMode && selectedItem) {
            await updateMutation.mutateAsync(
                { id: selectedItem.id, data: formD },
                {
                    onSuccess: () => {
                        setIsDrawerOpen(false);
                        resetForm();
                        setSelectedItem(null);
                    },
                }
            );
        } else {
            await createMutation.mutateAsync(formD, {
                onSuccess: () => {
                    setIsDrawerOpen(false);
                    resetForm();
                },
            });
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;

        await deleteMutation.mutateAsync(selectedItem.id, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedItem(null);
            },
        });
    };

    const resetForm = () => {
        setFormD({
            locale: '',
            namespace: '',
            key: '',
            value: '',
        });
    };

    const columns: ColumnDef<TranslateItem>[] = [
        {
            header: 'No',
            accessorKey: 'id',
            cell: ({ row }) => row.index + 1,
        },
        {
            header: 'Locale',
            accessorKey: 'locale',
        },
        {
            header: 'Namespace',
            accessorKey: 'namespace',
        },
        {
            header: 'Key',
            accessorKey: 'key',
        },
        {
            header: 'Value',
            accessorKey: 'value',
            cell: ({ row }) => (
                <div className="max-w-xs truncate">{row.original.value}</div>
            ),
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(row.original)}
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleOpenDelete(row.original)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-bold">Translations</h1>
                <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end">
                    <Input
                        className="md:max-w-xs"
                        placeholder="Cari (key / value / lainnya)..."
                        value={filters.search ?? ''}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                search: e.target.value,
                                page: 1,
                            }))
                        }
                    />
                    <Input
                        className="md:max-w-[140px]"
                        placeholder="Locale (mis. id, en)"
                        value={filters.locale ?? ''}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                locale: e.target.value,
                                page: 1,
                            }))
                        }
                    />
                    <Input
                        className="md:max-w-[160px]"
                        placeholder="Namespace (mis. artikel)"
                        value={filters.namespace ?? ''}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                namespace: e.target.value,
                                page: 1,
                            }))
                        }
                    />
                    <Button onClick={handleOpenCreate}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Translation
                    </Button>
                </div>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center h-52">
                    <Loader2 className="w-6 h-6 animate-spin" />
                </div>
            )}

            {isError && !isLoading && (
                <div className="flex items-center justify-center h-52">
                    <p className="text-destructive">Gagal memuat data translations</p>
                </div>
            )}

            {!isLoading && !isError && (
                <DataTableArticle columns={columns} data={data?.data ?? []} />
            )}

            {/* Drawer for Create/Edit */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-2xl">
                        <DrawerHeader>
                            <DrawerTitle>
                                {editMode ? 'Edit Translation' : 'Tambah Translation Baru'}
                            </DrawerTitle>
                            <DrawerDescription>
                                {editMode
                                    ? 'Update informasi translation'
                                    : 'Lengkapi form untuk menambahkan translation baru'}
                            </DrawerDescription>
                        </DrawerHeader>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="locale">
                                        Locale <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="locale"
                                        value={formD.locale}
                                        onChange={(e) =>
                                            setFormD({ ...formD, locale: e.target.value })
                                        }
                                        placeholder="e.g., en, id, zh"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="namespace">
                                        Namespace <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="namespace"
                                        value={formD.namespace}
                                        onChange={(e) =>
                                            setFormD({ ...formD, namespace: e.target.value })
                                        }
                                        placeholder="e.g., common, auth, dashboard"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="key">
                                    Key <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="key"
                                    value={formD.key}
                                    onChange={(e) =>
                                        setFormD({ ...formD, key: e.target.value })
                                    }
                                    placeholder="e.g., welcome_message, button.submit"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="value">
                                    Value <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="value"
                                    value={formD.value}
                                    onChange={(e) =>
                                        setFormD({ ...formD, value: e.target.value })
                                    }
                                    placeholder="Enter the translated text"
                                    rows={4}
                                    required
                                />
                            </div>
                            <DrawerFooter>
                                <Button type="submit" disabled={isPending} className="w-full">
                                    {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    {editMode ? 'Update' : 'Simpan'}
                                </Button>
                                <DrawerClose asChild>
                                    <Button variant="outline" type="button" className="w-full">
                                        Batal
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Delete Alert Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Translation</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus translation ini?
                            <div className="mt-2 p-2 bg-muted rounded-md">
                                <p className="text-sm font-medium">
                                    {selectedItem?.locale} / {selectedItem?.namespace} /{' '}
                                    {selectedItem?.key}
                                </p>
                            </div>
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}