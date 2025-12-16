"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSettings, upsertSettings } from "@/api/settings";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadScreen } from "@/components/loadingScreen";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const timezoneList = [
    "Asia/Jakarta",
    "Asia/Makassar",
    "Asia/Jayapura",
    "Asia/Singapore",
    "Asia/Kuala_Lumpur",
];

const schema = z.object({
    appName: z.string().min(1),
    appTitle: z.string().min(1),
    appDescription: z.string().min(1),
    appTheme: z.enum(["theme-1", "theme-2"]),
    // appMainColor: z.string().min(1),
    // appHeaderColor: z.string().min(1),
    // appFooterColor: z.string().min(1),
    // fontSize: z.coerce.number().min(10).max(24),
    // appDecoration: z.string().optional(),
    // enableChatBot: z.boolean(),
    // enableFacilitator: z.boolean(),
    // enablePaymentGateway: z.boolean(),
    // metaOg: z.string().url().optional(),
    timezone: z.string().min(1),
    appLogo: z.union([z.instanceof(File), z.string()]).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AppSettingScreen() {
    const query = useQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            appName: "",
            appTitle: "",
            appDescription: "",
            appTheme: "theme-1",
            // appMainColor: "#4CAF50",
            // appHeaderColor: "#2E7D32",
            // appFooterColor: "#1B5E20",
            // fontSize: 16,
            // appDecoration: "",
            // enableChatBot: true,
            // enableFacilitator: true,
            // enablePaymentGateway: false,
            // metaOg: "",
            timezone: "Asia/Jakarta",
            appLogo: undefined,
        },
    });

    useEffect(() => {
        if (query.data) {
            form.reset({
                appName: query.data.appName ?? "",
                appTitle: query.data.appTitle ?? "",
                appDescription: query.data.appDescription ?? "",
                appTheme: (query.data.appTheme as "theme-1" | "theme-2") ?? "theme-1",
                // appMainColor: query.data.appMainColor ?? "#4CAF50",
                // appHeaderColor: query.data.appHeaderColor ?? "#2E7D32",
                // appFooterColor: query.data.appFooterColor ?? "#1B5E20",
                // fontSize: Number(query.data.fontSize ?? 16),
                // appDecoration: query.data.appDecoration ?? "",
                // enableChatBot: Boolean(query.data.enableChatBot),
                // enableFacilitator: Boolean(query.data.enableFacilitator),
                // enablePaymentGateway: Boolean(query.data.enablePaymentGateway),
                // metaOg: query.data.metaOg ?? "",
                timezone: query.data.timezone ?? "Asia/Jakarta",
                appLogo: query.data.appLogo ?? undefined,
            });
        }
    }, [form, query.data]);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (values: FormValues) => {
            const fd = new FormData();

            const append = (key: keyof FormValues, val: any) => {
                if (val === undefined || val === null) return;
                if (typeof val === "string" && val.trim() === "") return;
                fd.append(String(key), String(val));
            };

            // File khusus
            if (values.appLogo instanceof File) {
                fd.append("appLogo", values.appLogo);
            }

            append("appName", values.appName);
            append("appTitle", values.appTitle);
            append("appDescription", values.appDescription);
            append("appTheme", values.appTheme);
            // append("appMainColor", values.appMainColor);
            // append("appHeaderColor", values.appHeaderColor);
            // append("appFooterColor", values.appFooterColor);
            // append("fontSize", values.fontSize);
            // append("appDecoration", values.appDecoration);
            // append("enableChatBot", values.enableChatBot);
            // append("enableFacilitator", values.enableFacilitator);
            // append("enablePaymentGateway", values.enablePaymentGateway);

            // if (values.metaOg && values.metaOg.trim() !== "") {
            //     append("metaOg", values.metaOg);
            // }

            append("timezone", values.timezone);

            return upsertSettings(fd);
        },
        onSuccess: () => {
            toast.success("Pengaturan tersimpan");
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: () => toast.error("Gagal menyimpan pengaturan"),
    });

    const onSubmit = form.handleSubmit((vals) => mutation.mutate(vals));

    if (query.isLoading) return <LoadScreen title="Settings" />;

    return (
        <form className="max-w-3xl mx-auto p-4 space-y-6" onSubmit={onSubmit}>
            <h1 className="text-2xl font-bold">App Setting</h1>

            <FieldGroup>
                <Field>
                    <FieldLabel>App Name</FieldLabel>
                    <Input {...form.register("appName")} />
                </Field>

                <Field>
                    <FieldLabel>App Title</FieldLabel>
                    <Input {...form.register("appTitle")} />
                </Field>

                <Field>
                    <FieldLabel>Description</FieldLabel>
                    <Input {...form.register("appDescription")} />
                </Field>

                {/* Theme (Controller) */}
                <Field>
                    <FieldLabel>Theme</FieldLabel>
                    <Controller
                        name="appTheme"
                        control={form.control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Theme" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectGroup>
                                        <SelectItem value="theme-1">Nature</SelectItem>
                                        <SelectItem value="theme-2">Tibet</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                        )}
                    />
                </Field>

                {/* <Field>
                    <FieldLabel>Main Color</FieldLabel>
                    <Input type="color" {...form.register("appMainColor")} />
                </Field>

                <Field>
                    <FieldLabel>Header Color</FieldLabel>
                    <Input type="color" {...form.register("appHeaderColor")} />
                </Field> 

                <Field>
                    <FieldLabel>Footer Color</FieldLabel>
                    <Input type="color" {...form.register("appFooterColor")} />
                </Field>

                <Field>
                    <FieldLabel>Font Size</FieldLabel>
                    <Input type="number" {...form.register("fontSize", { valueAsNumber: true })} />
                </Field>

                <Field>
                    <FieldLabel>Decoration</FieldLabel>
                    <Input {...form.register("appDecoration")} />
                </Field>

                <div className="flex md:flex-row flex-col items-center justify-between gap-4">
                    <Field>
                        <FieldLabel>Enable ChatBot</FieldLabel>
                        <Controller
                            name="enableChatBot"
                            control={form.control}
                            render={({ field }) => (
                                <div className="flex">
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    <span className="ml-2">
                                        {field.value ? "Enabled" : "Disabled"}
                                    </span>
                                </div>
                            )}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Enable Facilitator</FieldLabel>
                        <Controller
                            name="enableFacilitator"
                            control={form.control}
                            render={({ field }) => (
                                <div className="flex">
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    <span className="ml-2">
                                        {field.value ? "Enabled" : "Disabled"}
                                    </span>
                                </div>
                            )}
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Enable Payment Gateway</FieldLabel>
                        <Controller
                            name="enablePaymentGateway"
                            control={form.control}
                            render={({ field }) => (
                                <div className="flex">
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    <span className="ml-2">
                                        {field.value ? "Enabled" : "Disabled"}
                                    </span>
                                </div>
                            )}
                        />
                    </Field>
                </div>

                <Field>
                    <FieldLabel>Meta OG</FieldLabel>
                    <Input {...form.register("metaOg")} />
                </Field> */}

                {/* Timezone SELECT */}
                <Field>
                    <FieldLabel>Timezone</FieldLabel>
                    <Controller
                        name="timezone"
                        control={form.control}
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Timezone" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectGroup>
                                        {timezoneList.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {t}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </Field>

                {/* Logo */}
                <Field>
                    <FieldLabel>App Logo</FieldLabel>
                    <Controller
                        name="appLogo"
                        control={form.control}
                        render={({ field }) => (
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) field.onChange(file);
                                }}
                            />
                        )}
                    />
                </Field>
            </FieldGroup>

            <div className="flex gap-3">
                <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
            </div>
        </form>
    );
}
