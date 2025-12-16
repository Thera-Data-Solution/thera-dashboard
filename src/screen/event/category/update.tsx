"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { CategoriesSchema, type ICategory } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { updateCategory } from "@/api/categories";
import { Route } from "@/routes/app.event.categories.update.$catId";

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
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const navigate = useNavigate()
    type CustomCategoryField = {
        label: string
        type: "text"
    }

    const [customCategories, setCustomCategories] = useState<CustomCategoryField[]>([])

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

    useEffect(() => {
        const currentPrice = form.getValues("price");
        if (currentPrice > 0) {
            setDisplayPrice(formatPrice(currentPrice));
        }

        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [form, imagePreview]);

    useEffect(() => {
        if (category?.customFields && Array.isArray(category.customFields)) {
            setCustomCategories(category.customFields)
        }
    }, [category])



    const mutatiation = useMutation({
        mutationFn: (formData: FormData) => {
            return updateCategory(category.id, formData);
        },
        onSuccess: async () => {
            toast.success("Category berhasil diperbarui!");

            await queryClient.invalidateQueries({ queryKey: ["categories"] });
            await queryClient.invalidateQueries({ queryKey: ["category", category.id] });

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

    const addCustomField = () => {
        setCustomCategories((prev) => [
            ...prev,
            { label: "", type: "text" },
        ])
    }

    const updateCustomField = (index: number, value: string) => {
        setCustomCategories((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, label: value } : item
            )
        )
    }

    const removeCustomField = (index: number) => {
        setCustomCategories((prev) => prev.filter((_, i) => i !== index))
    }


    const isSubmitting = mutatiation.isPending;

    async function onSubmit(values: z.infer<typeof CategoriesSchema>) {
        const formData = new FormData();

        Object.entries(values).forEach(([key, val]) => {
            if (key === "price" && (values.isFree || values.isPayAsYouWish)) {
                formData.append(key, String(0));
            } else if (typeof val === "boolean" || typeof val === "number") {
                formData.append(key, String(val));
            } else if (val instanceof File) {
                formData.append(key, val);
            } else if (typeof val === "string") {
                formData.append(key, val);
            }
        });

        if (customCategories.length > 0) {
            const cleaned = customCategories.filter(
                (f) => f.label.trim() !== ""
            )

            if (cleaned.length > 0) {
                formData.append(
                    "customFields",
                    JSON.stringify(cleaned)
                )
            } else {
                formData.append("customFields", "[]")
            }
        } else {
            formData.append("customFields", "[]")
        }


        mutatiation.mutate(formData);
    }

    return (
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="font-bold text-2xl">✏️ Perbarui {category?.name}</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
                    <div className="border rounded-lg p-4 space-y-4">
                        <h3 className="font-semibold">Informasi Dasar</h3>

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
                                                    URL.revokeObjectURL(imagePreview);
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
                    </div>
                    <div className="border rounded-lg p-4 space-y-4">
                        <h3 className="font-semibold">Durasi</h3>

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
                    </div>
                    <div className="border rounded-lg p-4 space-y-3">
                        <h3 className="font-semibold">Perilaku Event</h3>

                        <div className="grid sm:grid-cols-2 gap-y-3">
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
                    </div>
                    <div className="border rounded-lg p-4 space-y-4">
                        <h3 className="font-semibold">Harga & Pembayaran</h3>

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
                                                            form.setValue("price", 0, { shouldValidate: true });
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
                                                            form.setValue("price", 0, { shouldValidate: true });
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
                                                        const numericString = rawValue.replace(/\D/g, "");
                                                        const numericValue = parseInt(numericString, 10);

                                                        if (!isNaN(numericValue) && numericValue >= 0) {
                                                            field.onChange(numericValue);
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
                    </div>

                    <div className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">Custom Form</h3>
                                <p className="text-sm text-muted-foreground">
                                    Field tambahan yang akan diisi user saat booking
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addCustomField}
                            >
                                + Tambah Field
                            </Button>
                        </div>

                        {customCategories.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Tidak ada custom field
                            </p>
                        )}

                        {customCategories.map((field, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    placeholder={`Pertanyaan ${index + 1} (contoh: Tujuan ikut?)`}
                                    value={field.label}
                                    onChange={(e) =>
                                        updateCustomField(index, e.target.value)
                                    }
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    disabled={customCategories.length === 1}
                                    size="sm"
                                    onClick={() => removeCustomField(index)}
                                >
                                    Hapus
                                </Button>
                            </div>
                        ))}
                    </div>


                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "🔄 Memperbarui..." : "Perbarui Kategori"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}