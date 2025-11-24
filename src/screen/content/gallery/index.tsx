import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
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
import {useCreateGallery, useDeleteGallery, useGallery, useUpdateGallery} from "@/hooks/galleryHook.tsx";

interface GalleryItem {
    id: string;
    title?: string;
    description?: string;
    imageUrl: string;
    createdAt?: string;
}

export default function Gallery() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: null as File | null,
    });

    const { data: galleryData, isLoading, isError } = useGallery();
    const createMutation = useCreateGallery();
    const updateMutation = useUpdateGallery();
    const deleteMutation = useDeleteGallery();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        if (formData.title) data.append('title', formData.title);
        if (formData.description) data.append('description', formData.description);
        if (formData.image) data.append('image', formData.image);

        await createMutation.mutateAsync(data, {
            onSuccess: () => {
                setIsCreateOpen(false);
                resetForm();
            },
        });
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;

        const data = new FormData();
        if (formData.title) data.append('title', formData.title);
        if (formData.description) data.append('description', formData.description);
        if (formData.image) data.append('image', formData.image);

        await updateMutation.mutateAsync(
            { id: selectedItem.id, data },
            {
                onSuccess: () => {
                    setIsEditOpen(false);
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
                setIsDeleteOpen(false);
                setSelectedItem(null);
            },
        });
    };

    const openEditDialog = (item: GalleryItem) => {
        setSelectedItem(item);
        setFormData({
            title: item.title || '',
            description: item.description || '',
            image: null,
        });
        setIsEditOpen(true);
    };

    const openDeleteDialog = (item: GalleryItem) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            image: null,
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-destructive">Gagal memuat data gallery</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Gallery</h1>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Gallery
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah Gallery Baru</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Judul</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Masukkan judul"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Masukkan deskripsi"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Gambar *</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending && (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                )}
                                Simpan
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryData?.data?.map((item: GalleryItem) => (
                    <Card key={item.id} className="overflow-hidden">
                        <img
                            src={item.imageUrl}
                            alt={item.title || 'Gallery image'}
                            className="w-full h-48 object-cover"
                        />
                        <CardHeader>
                            <CardTitle>{item.title || 'Untitled'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                {item.description || 'No description'}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditDialog(item)}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => openDeleteDialog(item)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Gallery</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Judul</Label>
                            <Input
                                id="edit-title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Masukkan judul"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Deskripsi</Label>
                            <Input
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Masukkan deskripsi"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-image">Gambar (opsional)</Label>
                            <Input
                                id="edit-image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={updateMutation.isPending}
                        >
                            {updateMutation.isPending && (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Update
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Alert Dialog */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Gallery</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.
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