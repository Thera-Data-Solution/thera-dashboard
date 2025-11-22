"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DateTime } from "luxon";
import type { ScheduleAdmin } from "@/types";
import {
    createSchedules,
    updateSchedules,
    deleteSchedules,
} from "@/api/schedules";
import { Route } from "@/routes/app.event.schedules.index";

type StatusDropdown = "ENABLE" | "BOOKED" | "CLOSED";

type SimpleCategory = {
    id: string;
    name: string;
};

type Props = {
    data: ScheduleAdmin[];
    categories: SimpleCategory[];
    timezone: string;
};

export default function CalendarComponents({ data, categories, timezone }: Props) {
    const [loading, setLoading] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<ScheduleAdmin | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [time, setTime] = useState("");
    const queryClient = Route.useRouteContext().queryClient
    // 

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const handlePreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    // 🧩 CREATE
    const createMutation = useMutation({
        mutationFn: async (payload: { dateTime: string; categoryId: string; status: string }) => {
            setLoading(true);
            const form = new FormData();
            form.append("dateTime", payload.dateTime);
            form.append("categoryId", payload.categoryId);
            form.append("status", payload.status);
            return await createSchedules(form);
        },
        onSuccess: () => {
            toast.success("Jadwal berhasil ditambahkan");
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
            setOpenDrawer(false);
            resetForm();
            setLoading(false);
        },
        onError: (err: unknown) => {
            toast.error(err instanceof Error ? err.message : "Gagal menambah jadwal");
            setLoading(false);
        },
    });

    // ✏️ UPDATE
    const updateMutation = useMutation({
        mutationFn: async (payload: { id: string; status: string }) => {
            setLoading(true);
            const form = new FormData();
            form.append("status", payload.status);
            return await updateSchedules(payload.id, form);
        },
        onSuccess: () => {
            toast.success("Status berhasil diperbarui");
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
            setOpenDialog(false);
            setLoading(false);
        },
        onError: (err: unknown) => {
            toast.error(err instanceof Error ? err.message : "Gagal memperbarui status");
            setLoading(false);
        },
    });

    // 🗑️ DELETE
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => await deleteSchedules(id),
        onSuccess: () => {
            toast.success("Jadwal berhasil dihapus");
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
            setOpenDialog(false);
        },
        onError: (err: unknown) => {
            toast.error(err instanceof Error ? err.message : "Gagal menghapus jadwal");
        },
    });

    const resetForm = () => {
        setSelectedDate(null);
        setSelectedCategory("");
        setTime("");
    };

    const handleAdd = () => {
        if (!selectedDate || !selectedCategory || !time) {
            toast.error("Lengkapi semua data");
            return;
        }

        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        const day = selectedDate.getDate();
        const [hour, minute] = time.split(":").map(Number);

        const dtLocal = DateTime.fromObject(
            { year, month, day, hour, minute },
            { zone: timezone },
        );
        console.log(dtLocal)
        if (!dtLocal.isValid) {
            toast.error("Tanggal atau waktu tidak valid");
            return;
        }

        const dtUTC = dtLocal.toUTC().toISO();

        createMutation.mutate({
            dateTime: dtUTC!,
            categoryId: selectedCategory,
            status: "ENABLE",
        });
    };

    const handleDelete = () => {
        if (!selectedEvent) return;
        deleteMutation.mutate(selectedEvent.id);
    };

    const handleStatusChange = (newStatus: StatusDropdown) => {
        if (!selectedEvent) return;
        updateMutation.mutate({ id: selectedEvent.id, status: newStatus });
    };

    return (
        <div className="flex-1 p-2 sm:p-4">
            <div className="mb-2 sm:mb-4 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">
                    Klik tanggal untuk menambah jadwal.
                </p>
            </div>

            <Card className="p-2 sm:p-4">
                <CardContent className="p-0">
                    <div className="mb-2 sm:mb-4 flex items-center justify-between">
                        <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <h2 className="text-center text-base sm:text-lg font-medium text-foreground">
                            {currentMonth.toLocaleString("id-ID", {
                                month: "long",
                                year: "numeric",
                            })}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] sm:text-xs">
                        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                            <div key={day} className="font-medium text-primary">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="mt-1 sm:mt-2 grid grid-cols-7 gap-1">
                        {Array.from({ length: startOfMonth(currentMonth).getDay() }).map(
                            (_, i) => (
                                <div key={`empty-${i}`} className="h-16 sm:h-24 w-full" />
                            ),
                        )}

                        {daysInMonth.map((date) => {
                            const daySchedules = data.filter((s) =>
                                isSameDay(new Date(s.dateTime), date),
                            );

                            return (
                                <div
                                    key={date.toISOString()}
                                    onClick={() => {
                                        setSelectedDate(date);
                                        setOpenDrawer(true);
                                    }}
                                    className={cn(
                                        "min-h-[3.5rem] sm:min-h-[6rem] p-1 rounded-md border cursor-pointer flex flex-col items-start justify-start",
                                        isToday(date) && "border-primary bg-primary/10",
                                    )}
                                >
                                    {loading && <Loader2 className="animate-spin text-primary" />}
                                    <div className="text-[11px] sm:text-xs font-semibold">
                                        {date.getDate()}
                                    </div>

                                    {daySchedules.map((event) => (
                                        <button
                                            key={event.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedEvent(event);
                                                setOpenDialog(true);
                                            }}
                                            className="mt-1 w-full truncate rounded bg-secondary px-1 py-0.5 text-[9px] sm:text-[10px] flex items-center justify-between"
                                        >
                                            <span>{event.categories.name}</span>
                                            <span>
                                                {new Date(event.dateTime).toLocaleTimeString(
                                                    "id-ID",
                                                    { hour: "2-digit", minute: "2-digit" },
                                                )}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Drawer tambah jadwal */}
            <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Tambah Jadwal</DrawerTitle>
                    </DrawerHeader>
                    <div className="space-y-3 px-4 py-2">
                        <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>
                    <DrawerFooter>
                        <Button onClick={handleAdd} disabled={createMutation.isPending}>
                            {createMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Simpan
                        </Button>
                        <DrawerClose>
                            <Button variant="ghost">Batal</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            {/* Dialog hapus dan edit */}
            {selectedEvent && (
                <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-semibold">
                                Hapus Jadwal?
                            </AlertDialogTitle>
                            <Card className="p-4">
                                <CardHeader className="flex flex-row justify-between items-center p-0">
                                    <CardTitle className="text-base font-medium">
                                        Detail Jadwal
                                    </CardTitle>
                                    <Badge>{selectedEvent.categories.name}</Badge>
                                </CardHeader>
                                <Separator className="my-3" />
                                <CardContent className="p-0 grid gap-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span>Tanggal:</span>
                                        <span>
                                            {new Date(selectedEvent.dateTime).toLocaleDateString(
                                                "id-ID",
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Waktu:</span>
                                        <span>
                                            {new Date(selectedEvent.dateTime).toLocaleTimeString(
                                                "id-ID",
                                                { hour: "2-digit", minute: "2-digit" },
                                            )}
                                        </span>
                                    </div>

                                    <Select
                                        onValueChange={handleStatusChange}
                                        value={selectedEvent.status}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Ubah status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ENABLE">ENABLE</SelectItem>
                                            <SelectItem value="BOOKED">BOOKED</SelectItem>
                                            <SelectItem value="CLOSED">CLOSED</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </CardContent>
                            </Card>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}
