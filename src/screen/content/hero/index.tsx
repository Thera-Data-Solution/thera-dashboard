"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
    FieldSeparator,
    FieldDescription,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
;
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { heroSchema } from "@/lib/form/heroSchema";
import { FileUpload } from "@/components/form-fields/file-upload";
import { useEffect } from "react";
import { createOrUpdateHero } from "@/api/hero";
import { toast } from "sonner";
import { Route } from "@/routes/app.content.hero.index";
import { FormField } from "@/components/ui/form";

type Schema = z.infer<typeof heroSchema>;

interface iHero {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    themeType: string;
    image: string | null;
}

export function HeroManagement({ data }: { data: iHero }) {
    const queryClient = Route.useRouteContext().queryClient;

    const form = useForm<Schema>({
        resolver: zodResolver(heroSchema as any),
        defaultValues: {
            title: "",
            subtitle: "",
            description: "",
            buttonText: "",
            buttonLink: "",
            themeType: data.themeType ?? "style1",
            image: undefined,
        },
    });

    // -------------------------------------
    // RESET FORM — FIX SELECT & IMAGE
    // -------------------------------------
    useEffect(() => {
        if (!data) return;

        form.reset(
            {
                title: data.title ?? "",
                subtitle: data.subtitle ?? "",
                description: data.description ?? "",
                buttonText: data.buttonText ?? "",
                buttonLink: data.buttonLink ?? "",
                themeType: data.themeType ?? "",
                image: data.image ?? "",
            },
            {
                keepDirtyValues: false,
                keepTouched: false,
            }
        );
    }, [data, form]);


    // -------------------------------------
    // MUTATION
    // -------------------------------------
    const mutation = useMutation({
        mutationFn: async (payload: Schema) => {
            const fd = new FormData();

            const imageFile = Array.isArray(payload.image)
                ? payload.image[0]
                : payload.image;

            fd.append("title", payload.title);
            fd.append("subtitle", payload.subtitle);
            fd.append("description", payload.description);
            fd.append("buttonText", payload.buttonText ?? "");
            fd.append("buttonLink", payload.buttonLink ?? "");
            fd.append("themeType", payload.themeType ?? "");

            // kirim file hanya jika user upload baru
            if (imageFile instanceof File) {
                fd.append("image", imageFile);
            }

            // jika user menghapus existing image → kirim flag
            if (!imageFile) {
                fd.append("removeImage", "true");
            }

            return await createOrUpdateHero(fd);
        },
        onSuccess: () => {
            toast.success("Berhasil");
            queryClient.invalidateQueries({
                queryKey: ["hero"],
            });
            form.reset();
        },
        onError: () => {
            toast.error("Gagal menyimpan");
        },
    });

    const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col p-5 w-full rounded-md gap-2 border"
        >
            <FieldGroup>
                <h2 className="mb-2 font-bold text-2xl tracking-tight">
                    Banner Management
                </h2>

                {/* Title & Subtitle */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <Controller
                        name="title"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Title *</FieldLabel>
                                <Input {...field} placeholder="Enter banner title" />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        name="subtitle"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Subtitle *</FieldLabel>
                                <Input {...field} placeholder="Enter subtitle" />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                </div>

                {/* Description */}
                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Description *</FieldLabel>
                            <Textarea {...field} />
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <FieldSeparator className="my-4" />

                {/* Button */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <Controller
                        name="buttonText"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Button Text</FieldLabel>
                                <Input {...field} placeholder="Contoh: Tentang Saya" />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />

                    <Controller
                        name="buttonLink"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Button Link</FieldLabel>
                                <Input {...field} placeholder="/produk atau /about" />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                </div>

                <FieldSeparator className="my-4" />

                <FormField
                    name="themeType"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Choose Theme</FieldLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an option" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="style1">Style 1</SelectItem>
                                    <SelectItem value="style2">Style 2</SelectItem>
                                </SelectContent>
                            </Select>

                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <FieldSeparator className="my-4" />

                {/* Image */}
                <Controller
                    name="image"
                    control={form.control}
                    render={({ fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Image</FieldLabel>
                            <FieldDescription>Max. 2MB</FieldDescription>

                            <FileUpload
                                name="image"
                                accept="image/png, image/jpeg"
                                maxFiles={1}
                                maxSize={2100000}
                                setValue={form.setValue as any}
                                defaultUrl={data?.image ?? ""}
                                placeholder="JPG atau PNG hingga 2MB. Drag & drop atau klik untuk pilih."
                            />

                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                {/* Submit */}
                <div className="flex justify-end pt-3">
                    <Button size="sm" className="rounded-lg" disabled={mutation.isPending}>
                        {mutation.isPending ? "Saving..." : "Save"}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
}
