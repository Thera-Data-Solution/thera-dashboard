import { createPartner, deletePartner } from "@/api/partner";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
import { Route } from "@/routes/app.setting.partner";

interface IProps {
    id: string;
    logo: string;
}

export default function Partner({ ix }: { ix: IProps[] }) {
    const queryClient = Route.useRouteContext().queryClient;
    const [showAddDialog, setShowAddDialog] = React.useState(false); // Diubah namanya agar lebih jelas
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const [deleteId, setDeleteId] = React.useState<string | null>(null);

    const deleteMut = useMutation({
        mutationFn: async (id: string) => deletePartner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["partners"] });
            setShowDeleteConfirm(false); // Tutup konfirmasi setelah berhasil
            setDeleteId(null);
        },
    });

    const addMut = useMutation({
        mutationFn: async (data: FormData) => createPartner(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["partners"] });
            setShowAddDialog(false); // Menggunakan state yang diubah namanya
        },
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Cek jika sedang loading, jangan submit lagi
        if (addMut.isPending) return;

        const formData = new FormData(e.currentTarget);
        addMut.mutate(formData);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            deleteMut.mutate(deleteId);
        }
    };

    const loading = addMut.isPending || deleteMut.isPending;

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Partner</h2>
                <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Partner
                </Button>
            </div>

            {/* Konten Utama */}
            <div className="grid md:grid-cols-4 grid-cols-2 gap-4 mt-4">
                {ix.map((item) => (
                    <div key={item.id} className="text-center">
                        <img
                            src={item.logo}
                            alt="Partner Logo"
                            className="h-48 w-48 mx-auto object-contain transition-transform duration-200 hover:scale-105"
                        />
                        <Button
                            className="mt-2 w-full"
                            variant="destructive"
                            disabled={deleteMut.isPending}
                            // Mengubah onClick untuk menampilkan dialog konfirmasi
                            onClick={() => handleDeleteClick(item.id)}
                        >
                            Delete
                        </Button>
                    </div>
                ))}
            </div>

            {/* Dialog Tambah Partner (Add Partner) */}
            {/* Menggunakan state yang diubah namanya: showAddDialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                {/* PERBAIKAN: Form sekarang membungkus konten di dalam DialogContent */}
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={onSubmit}>
                        <DialogHeader>
                            <DialogTitle>Add Partner</DialogTitle>
                            <DialogDescription>
                                Unggah logo partner di sini.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-3">
                                <Label htmlFor="logo">Logo</Label>
                                {/* PERBAIKAN: Tambahkan `accept` untuk memfilter file gambar */}
                                <Input name="logo" type="file" required accept="image/*" /> 
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={addMut.isPending}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            {/* PERBAIKAN: Type submit sekarang berfungsi karena form di dalam DialogContent */}
                            <Button type="submit" disabled={addMut.isPending}>
                                {addMut.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Konfirmasi Penghapusan (Delete Confirmation) */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus partner ini? Aksi ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeleteId(null);
                            }}
                            disabled={deleteMut.isPending}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={deleteMut.isPending}
                        >
                            {deleteMut.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                "Hapus"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* PERBAIKAN: Loading Overlay Diletakkan di Luar Konten Utama */}
            {/* PERBAIKAN: Menggunakan `fixed` dan z-index tinggi untuk menutupi seluruh viewport */}
            {loading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <Loader2 className="h-10 w-10 animate-spin text-white" />
                </div>
            )}
        </div>
    );
}