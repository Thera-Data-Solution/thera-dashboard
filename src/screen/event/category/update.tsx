"use client";

import { useState, useTransition, useEffect } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner"; // Impor toast
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { CategoriesSchema, type ICategory } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { updateCategory } from "@/api/categories";
import { Route } from "@/routes/app.event.categories.update.$catId";
import { useRouter } from "@tanstack/react-router";

// --- Fungsi Format Harga ---
const formatPrice = (value: number | string) => {
    if (value === 0 || value === "" || value === undefined) {
        return "";
    }
    const stringValue = String(value).replace(/\D/g, "");
    const number = Number(stringValue);

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
};

export default function CategoryUpdate({ category }: { category: ICategory }) {
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    // Hapus state isSubmitting, ganti dengan mutatiation.isPending
    const navigate = useNavigate()
    const queryClient = Route.useRouteContext().queryClient

    const form = useForm<z.infer<typeof CategoriesSchema>>({
        resolver: zodResolver(CategoriesSchema),
        defaultValues: {
            name: category?.name ?? "",
            description: category?.description ?? "",
            descriptionEn: category?.descriptionEn ?? "",
            isManual: category?.isManual ?? false,
            image: undefined,
            start: category?.start ?? 0,
            end: category?.end ?? 0,
            price: category?.price ?? 0,
            isFree: category.isFree ?? false,
            isGroup: category?.isGroup ?? false,
            location: category?.location ?? "",
            isPayAsYouWish: category?.isPayAsYouWish ?? false,
            disable: category?.disable ?? false,
        },
    });

    const [displayPrice, setDisplayPrice] = useState("");

    // --- Efek untuk Harga dan Pratinjau Gambar ---
    useEffect(() => {
        // Inisialisasi displayPrice
        const currentPrice = form.getValues("price");
        if (currentPrice > 0) {
            setDisplayPrice(formatPrice(currentPrice));
        }

        // Cleanup function untuk URL pratinjau gambar
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [form, imagePreview]);


    // --- Mutasi Pembaruan Kategori ---
    const mutatiation = useMutation({
        mutationFn: (formData: FormData) => {
            return updateCategory(category.id, formData);
        },
        onSuccess: async () => {
            toast.success("Category berhasil diperbarui!"); // Notifikasi Sukses
            
            await queryClient.invalidateQueries({ queryKey: ["categories"] });
            await queryClient.invalidateQueries({ queryKey: ["category", category.id] });

            // Penggunaan router.invalidate() di TanStack Router yang tepat:
            // Jika Anda hanya ingin re-run loader untuk rute yang sedang aktif.
            // await router.invalidate(); 
            
            // Dalam kasus ini, navigasi mungkin sudah cukup, tetapi mari kita pastikan
            // navigasi dilakukan setelah invalidation
            
            navigate({
                to: "/app/event/categories",
                replace: true,
            });
        },
        onError: (error) => {
            console.error("Update failed:", error);
            toast.error("Gagal memperbarui Category.", {
                description: error instanceof Error ? error.message : "Terjadi kesalahan saat menghubungi server.",
            });
        }
    })

    const isSubmitting = mutatiation.isPending; // Gunakan status pending dari mutasi

    async function onSubmit(values: z.infer<typeof CategoriesSchema>) {
        const formData = new FormData();
        
        // Mempersiapkan FormData
        Object.entries(values).forEach(([key, val]) => {
            if (key === "price" && (values.isFree || values.isPayAsYouWish)) {
                // Harga disetel ke 0 jika gratis atau pay as you wish
                formData.append(key, String(0));
            } else if (typeof val === "boolean" || typeof val === "number") {
                formData.append(key, String(val));
            } else if (val instanceof File) {
                // Hanya tambahkan file jika ada file baru yang dipilih
                formData.append(key, val);
            } else if (typeof val === "string") {
                formData.append(key, val);
            }
        });
        
        // Hapus penambahan 'slug' acak, karena ini biasanya harus diurus di backend
        // atau jika harus di-generate di client, pastikan itu sesuai dengan schema dan API.
        // Jika schema CategoriesSchema tidak memiliki 'slug', ini akan menyebabkan masalah.
        // Saya asumsikan CategoriesSchema Anda sudah menangani field yang diperlukan.
        // Jika 'slug' diperlukan dan tidak ada di schema:
        // formData.append('slug', Math.random().toString(36).substring(2, 15)); 
        
        mutatiation.mutate(formData);
    }

    // --- Render Komponen ---
    return (
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="font-bold text-2xl">✏️ Perbarui {category?.name}</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama Kategori</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Private Therapy" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lokasi</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Online / Harvest City" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Deskripsi (Indonesia)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Deskripsi singkat" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="descriptionEn"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Deskripsi (English)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Short description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gambar (Ganti)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            field.onChange(file);
                                            if (imagePreview) {
                                                URL.revokeObjectURL(imagePreview); // Revoke URL lama
                                            }
                                            if (file) {
                                                const previewUrl = URL.createObjectURL(file);
                                                setImagePreview(previewUrl);
                                            } else {
                                                setImagePreview(null);
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Pratinjau Gambar Baru"
                                        className="mt-2 w-40 rounded shadow"
                                    />
                                ) : (
                                    category.image && (
                                        <img
                                            src={category.image}
                                            alt="Gambar Saat Ini"
                                            className="mt-2 w-40 rounded shadow"
                                        />
                                    )
                                )}
                            </FormItem>
                        )}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="start"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Durasi Mulai (menit)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            // Menggunakan event.target.valueAsNumber lebih aman
                                            onChange={(e) =>
                                                field.onChange(e.target.valueAsNumber ?? 0)
                                            }
                                            value={field.value ?? 0}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="end"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Durasi Akhir (menit)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            onChange={(e) =>
                                                field.onChange(e.target.valueAsNumber ?? 0)
                                            }
                                            value={field.value ?? 0}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-y-4">
                        <FormField
                            control={form.control}
                            name="isManual"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormLabel>Pilih Manual oleh Klien</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isGroup"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormLabel>Acara Grup (Multiple Booking)</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="disable"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormLabel>Nonaktifkan</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 items-end">
                        <div className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="isFree"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormLabel>Gratis</FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(checked);
                                                    if (checked) {
                                                        form.setValue("isPayAsYouWish", false);
                                                        form.setValue("price", 0, { shouldValidate: true }); // Reset harga dan validasi
                                                        setDisplayPrice("");
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isPayAsYouWish"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormLabel>Bayar Sesukamu (Pay As You Wish)</FormLabel>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(checked);
                                                    if (checked) {
                                                        form.setValue("isFree", false);
                                                        form.setValue("price", 0, { shouldValidate: true }); // Reset harga dan validasi
                                                        setDisplayPrice("");
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => {
                                const isFree = form.watch("isFree");
                                const isPayAsYouWish = form.watch("isPayAsYouWish");
                                const disabled = isFree || isPayAsYouWish;

                                return (
                                    <FormItem>
                                        <FormLabel>Harga</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                disabled={disabled}
                                                value={displayPrice}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value;
                                                    // Hanya ambil angka (termasuk . jika ada, walau formatPrice menghapusnya)
                                                    const numericString = rawValue.replace(/\D/g, "");
                                                    const numericValue = parseInt(numericString, 10);

                                                    if (!isNaN(numericValue) && numericValue >= 0) {
                                                        // Update form value dengan angka murni
                                                        field.onChange(numericValue);
                                                        // Update display value dengan format Rupiah
                                                        setDisplayPrice(formatPrice(numericValue));
                                                    } else {
                                                        field.onChange(0);
                                                        setDisplayPrice("");
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "🔄 Memperbarui..." : "Perbarui Kategori"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}