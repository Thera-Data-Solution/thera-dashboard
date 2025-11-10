"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    useCreateBlockNote
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/react/style.css";
import {type Block } from "@blocknote/core";


const formSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    excerpt: z.string().optional(),
    isPublished: z.boolean(),
    coverImage: z.union([z.string().url(), z.instanceof(File)]).optional(),
    articleType: z.enum(["BLOG", "PAGE"]),
    body: z.any().optional(),
});

export type PostFormValues = z.infer<typeof formSchema>;

export function PostForm({
    onSubmit,
    defaultValues,
}: {
    onSubmit: (values: FormData) => void;
    defaultValues?: Partial<PostFormValues> & { id?: string };
}) {
    const [previewImage, setPreviewImage] = useState<string | null>(
        typeof defaultValues?.coverImage === "string" ? defaultValues.coverImage : null
    );
    const [manualSlug, setManualSlug] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const editor = useCreateBlockNote({
        initialContent: (defaultValues?.body as Block[]) || undefined,
    });

    const form = useForm<PostFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isPublished: false,
            articleType: "BLOG",
            ...defaultValues,
        },
    });

    const titleValue = form.watch("title");

    useEffect(() => {
        if (!manualSlug) {
            const slug = titleValue
                ?.toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-");
            form.setValue("slug", slug || "");
        }
    }, [titleValue, manualSlug, form]);

    const handleFormSubmit = async (values: PostFormValues) => {
        const data = new FormData();
        Object.entries(values).forEach(([key, val]) => {
            if (key === "body") {
                data.append("body", JSON.stringify(editor.document)); // simpan JSON
            } else if (val instanceof File) {
                data.append(key, val);
            } else {
                data.append(key, String(val ?? ""));
            }
        });

        setIsPending(true);
        try {
            onSubmit(data);
            toast.success("Post saved!");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 mt-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        {/* Title */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Slug + Manual Switch */}
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center justify-between">
                                        <span>Slug</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">Manual</span>
                                            <Switch checked={manualSlug} onCheckedChange={setManualSlug} />
                                        </div>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Auto generated slug" disabled={!manualSlug} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Excerpt */}
                    <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Excerpt</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Short description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Cover Image */}
                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover Image</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            field.onChange(file);
                                            if (file) setPreviewImage(URL.createObjectURL(file));
                                        }}
                                    />
                                </FormControl>
                                {previewImage && (
                                    <div className="mt-2 flex gap-2">
                                        <img
                                            src={previewImage}
                                            alt="Preview Cover"
                                            width={120}
                                            height={120}
                                            className="object-contain border rounded"
                                        />
                                    </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Article Type */}
                    <FormField
                        control={form.control}
                        name="articleType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Article Type</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BLOG">Blog</SelectItem>
                                            <SelectItem value="PAGE">Page</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Body (BlockNote) */}
                    <FormField
                        control={form.control}
                        name="body"
                        render={() => (
                            <FormItem>
                                <FormLabel>Body</FormLabel>
                                <FormControl>
                                    <div className="border rounded-md p-2">
                                        <BlockNoteView editor={editor} theme="light" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Publish */}
                    <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="mb-0">Publish</FormLabel>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? "Saving..." : "Save Post"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}