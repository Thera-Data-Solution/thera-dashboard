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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { CategoriesSchema } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { createCategory } from "@/api/categories";
import { Route } from "@/routes/app.event.categories.new";

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

type CustomCategoryField = {
    label: string
    type: "text"
}

export default function CategoryCreate() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate()
    const queryClient = Route.useRouteContext().queryClient


    const [customCategories, setCustomCategories] = useState<CustomCategoryField[]>([])


    const form = useForm<z.infer<typeof CategoriesSchema>>({
        resolver: zodResolver(CategoriesSchema),
        defaultValues: {
            name: "",
            description: "",
            descriptionEn: "",
            isManual: false,
            image: undefined,
            start: 0,
            end: 0,
            price: 0,
            isFree: false,
            isGroup: false,
            location: "",
            isPayAsYouWish: false,
            disable: false,
        },
    });

    const [displayPrice, setDisplayPrice] = useState("");

    useEffect(() => {
        const currentPrice = form.getValues("price");
        if (currentPrice > 0) {
            setDisplayPrice(formatPrice(currentPrice));
        }
    }, [form]);

    const mutatiation = useMutation({
        mutationFn: (formData: FormData) => {
            return createCategory(formData);
        },
        onSuccess: () => {
            navigate({
                to: '/app/event/categories',
                replace: true
            })
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            })
        }
    })

    async function onSubmit(values: z.infer<typeof CategoriesSchema>) {
        setIsSubmitting(true);
        const formData = new FormData();
        Object.entries(values).forEach(([key, val]) => {
            if (typeof val === "boolean" || typeof val === "number") {
                formData.append(key, String(val));
            } else if (val instanceof File) {
                formData.append(key, val);
            } else if (typeof val === "string") {
                formData.append(key, val);
            }
        });
        formData.append('slug', Math.random().toString(36).substring(2, 15))
        if (customCategories.length > 0) {
            const cleaned = customCategories.filter(
                (f) => f.label.trim() !== ""
            )

            if (cleaned.length > 0) {
                formData.append(
                    "customFields",
                    JSON.stringify(cleaned)
                )
            }
        }

        mutatiation.mutate(formData);
    }

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


    return (
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="font-bold text-2xl">Create Category</div>
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
                                        <FormLabel>Category Name</FormLabel>
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
                                        <FormLabel>Location</FormLabel>
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
                                    <FormLabel>Description (Indonesia)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Short description" {...field} />
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
                                    <FormLabel>Description (English)</FormLabel>
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
                                    <FormLabel>Image (replace)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                field.onChange(file);
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
                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="New Image Preview"
                                            className="mt-2 w-40 rounded shadow"
                                        />
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
                                        <FormLabel>Start (minutes)</FormLabel>
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
                                        <FormLabel>End (minutes)</FormLabel>
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
                                        <FormLabel>Manual Select from client</FormLabel>
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
                                        <FormLabel>Is Group Event (Multiple Booking)</FormLabel>
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
                                        <FormLabel>Disable</FormLabel>
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
                                            <FormLabel>Free</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(checked);
                                                        if (checked) {
                                                            form.setValue("isPayAsYouWish", false);
                                                            form.setValue("price", 0);
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
                                            <FormLabel>Pay As You Wish</FormLabel>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        field.onChange(checked);
                                                        if (checked) {
                                                            form.setValue("isFree", false);
                                                            form.setValue("price", 0);
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
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    disabled={disabled}
                                                    value={displayPrice}
                                                    onChange={(e) => {
                                                        const rawValue = e.target.value;
                                                        const numericValue = parseInt(rawValue.replace(/\D/g, ""), 10);

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
                                    placeholder="Label (contoh: Tujuan ikut?)"
                                    value={field.label}
                                    onChange={(e) =>
                                        updateCustomField(index, e.target.value)
                                    }
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeCustomField(index)}
                                >
                                    Hapus
                                </Button>
                            </div>
                        ))}
                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Create Category"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}