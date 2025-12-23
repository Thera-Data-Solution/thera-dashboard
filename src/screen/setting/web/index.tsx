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
    appTheme: z.enum(["theme-1", "theme-2", "theme-3", "theme-4"]),
    timezone: z.string().min(1),
    appLogo: z.union([z.instanceof(File), z.string()]).optional(),

    telegramBotToken: z.string().optional(),
    telegramChatId: z.string().optional(),

    mailKey: z.string().optional(),
    mailSecret: z.string().optional(),

    discordReportId: z.string().optional(),
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
            timezone: "Asia/Jakarta",
            appLogo: undefined,

            telegramBotToken: "",
            telegramChatId: "",
            mailKey: "",
            mailSecret: "",
            discordReportId: "",
        },

    });

    useEffect(() => {
        if (query.data) {
            form.reset({
                appName: query.data.appName ?? "",
                appTitle: query.data.appTitle ?? "",
                appDescription: query.data.appDescription ?? "",
                appTheme: (query.data.appTheme as "theme-1" | "theme-2") ?? "theme-1",
                timezone: query.data.timezone ?? "Asia/Jakarta",
                appLogo: query.data.appLogo ?? undefined,

                telegramBotToken: query.data.telegramBotToken ?? "",
                telegramChatId: query.data.telegramChatId ?? "",
                mailKey: query.data.mailKey ?? "",
                mailSecret: query.data.mailSecret ?? "",
                discordReportId: query.data.discordReportId ?? "",
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
            append("telegramBotToken", values.telegramBotToken);
            append("telegramChatId", values.telegramChatId);
            append("mailKey", values.mailKey);
            append("mailSecret", values.mailSecret);
            append("discordReportId", values.discordReportId);


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
                                        <SelectItem value="theme-3">Crimson Ash</SelectItem>
                                        <SelectItem value="theme-4">Rose Sage</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                        )}
                    />
                </Field>
                
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


                <h2 className="text-lg font-semibold pt-4">Telegram</h2>

                <Field>
                    <FieldLabel>Bot Token</FieldLabel>
                    <Input {...form.register("telegramBotToken")} placeholder="123456:ABC-DEF..." />
                </Field>

                <Field>
                    <FieldLabel>Chat ID</FieldLabel>
                    <Input {...form.register("telegramChatId")} placeholder="-100xxxxxxxxx" />
                </Field>

                <h2 className="text-lg font-semibold pt-4">Email</h2>

                <Field>
                    <FieldLabel>Mail Key</FieldLabel>
                    <Input {...form.register("mailKey")} />
                </Field>

                <Field>
                    <FieldLabel>Mail Secret</FieldLabel>
                    <Input type="password" {...form.register("mailSecret")} />
                </Field>


                <h2 className="text-lg font-semibold pt-4">Discord</h2>

                <Field>
                    <FieldLabel>Report Channel ID</FieldLabel>
                    <Input {...form.register("discordReportId")} />
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
