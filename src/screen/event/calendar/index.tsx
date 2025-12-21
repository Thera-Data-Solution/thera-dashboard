"use client";

import { useState } from "react";
import CalendarComponents from "@/components/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { importSchedules, ScheduleAdmin } from "@/services/schedules";
// import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { ScheduleAdmin } from "@/types";

type SimpleCategory = {
  id: string;
  name: string;
};

export default function SchedulesPage({
  schedules,
  categories,
  timezone
}: {
  schedules: ScheduleAdmin[];
  categories: SimpleCategory[];
  timezone: string
}) {

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  //   const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (!file) return;

  //     const reader = new FileReader();
  //     reader.onload = async (event) => {
  //       const data = new Uint8Array(event.target?.result as ArrayBuffer);
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[sheetName];
  //       const jsonData = XLSX.utils.sheet_to_json(worksheet);

  //       const result = await importSchedules(jsonData);

  //       if (result.success) {
  //         window.location.reload();
  //       } else {
  //         alert("Gagal import: " + result.message);
  //       }
  //     };

  //     reader.readAsArrayBuffer(file);
  //   };

  //   const handleDownloadTemplate = () => {
  //     const worksheet = XLSX.utils.json_to_sheet([
  //       {
  //         id: "",
  //         date: "2025-08-01",
  //         time: "09:00:00",
  //         categoryId: "uuid-kategori-di-sini",
  //       },
  //     ]);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
  //     XLSX.writeFile(workbook, "schedules_template.xlsx");
  //   };

  // const filteredSchedules = selectedCategoryId
  //   ? schedules.filter((s) => s.categories?.id === selectedCategoryId)
  //   : schedules;
  const filteredSchedules = (selectedCategoryId === "all" ||!selectedCategoryId) ? schedules : schedules.filter((s) => s.categories?.id === selectedCategoryId)

  if (timezone === '') {
    return (
      <div>
        Empty Timezone
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Bagian Filter + Impor/Unduh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Filter */}
        <Card>
          <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between p-4">
            <Label htmlFor="category-filter" className="mb-2 sm:mb-0 sm:mr-2">
              Filter kategori:
            </Label>
            <Select onValueChange={setSelectedCategoryId}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Kategori</SelectLabel>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Card Impor / Unduh */}
        <Card>
          <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between p-4">
            {/* <Label htmlFor="import-file" className="sr-only">Impor File</Label>
            <Input
              id="import-file"
              type="file"
              accept=".xlsx"
              onChange={handleImport}
              className="mb-2 sm:mb-0"
            />
            <Button onClick={handleDownloadTemplate} className="text-sm w-full sm:w-auto">
              Unduh Template
            </Button> */}
          </CardContent>
        </Card>
      </div>

      {/* Komponen Kalender Anda */}
      <CalendarComponents data={filteredSchedules} categories={categories} timezone={timezone} />
    </div>
  );
}