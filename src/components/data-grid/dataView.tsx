"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  FileQuestion,
  LayoutGrid,
  MoreHorizontal,
  Rows,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Column } from "./index";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

interface DataViewProps<T extends { id: string }> {
  caption: string | null;
  data: T[];
  columns: Column<T>[];
  titleKey?: keyof T;
  descriptionKeys?: (keyof T)[];
  imageKeys?: keyof T;
  imageType?: "avatar" | "banner";
  actionButtons?: {
    key: string;
    label: string;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link"
      | "info"
      | "success"
      | "warning";
    action: (row: T) => void;
  }[];
}

export function KepsDataView<T extends { id: string }>({
  caption,
  data,
  columns,
  titleKey,
  descriptionKeys = [],
  actionButtons = [],
  imageKeys,
  imageType = "avatar",
}: DataViewProps<T>) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // ✅ State kosong (UX lembut)
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
        <div className="rounded-full bg-muted/60 p-4 shadow-sm backdrop-blur-sm">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold">Belum ada data</h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Tambahkan data baru atau ubah filter pencarian untuk melihat hasil.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="sm">Tambah Data</Button>
          <Button size="sm" variant="outline">
            Muat Ulang
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-auto min-h-[80vh] transition-all duration-300">
      {/* 🔘 Tombol switch mode */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-lg font-semibold tracking-tight">
          {caption || "Data View"}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="w-4 h-4 mr-1" /> Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <Rows className="w-4 h-4 mr-1" /> List
          </Button>
        </div>
      </div>

      {/* ✨ Transisi lembut antar mode */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="
              grid gap-5
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
            "
          >
            {data.map((row) => {
              const primaryButtons = actionButtons.slice(0, 2);
              const secondaryButtons = actionButtons.slice(2);

              return (
                <Card
                  key={row.id}
                  className="flex flex-col justify-between h-full overflow-hidden border border-border/60 hover:border-primary/50 transition-colors hover:shadow-md group"
                >
                  {/* Gambar */}
                  {imageType === "banner" ? (
                    <div className="relative h-32 w-full">
                      <img
                        src={
                          imageKeys && row[imageKeys]
                            ? String(row[imageKeys])
                            : `https://picsum.photos/seed/${row.id}/400`
                        }
                        alt="Banner"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ) : (
                    <div className="flex justify-center pt-6">
                      <Avatar className="w-20 h-20 border-2 border-muted-foreground/20">
                        <AvatarImage
                          src={
                            imageKeys && row[imageKeys]
                              ? String(row[imageKeys])
                              : `https://picsum.photos/seed/${row.id}/200`
                          }
                        />
                        <AvatarFallback>
                          {titleKey
                            ? String(row[titleKey]).charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}

                  {/* Isi */}
                  <CardHeader className="p-4">
                    <CardTitle className="text-base font-semibold truncate">
                      {titleKey ? (row[titleKey] as ReactNode) : "Tanpa Judul"}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-4 pb-3 text-sm text-muted-foreground space-y-1">
                    {descriptionKeys.map((k, i) => {
                      const label =
                        columns.find((c) => c.key === k)?.label || k;
                      return (
                        <div key={i} className="flex flex-wrap gap-x-1">
                          <span className="font-medium text-foreground/80">
                            {label as string}:
                          </span>
                          <span className="truncate">{String(row[k])}</span>
                        </div>
                      );
                    })}
                  </CardContent>

                  {/* Tombol */}
                  {actionButtons.length > 0 && (
                    <CardFooter className="flex flex-wrap justify-end gap-2 px-4 pb-4">
                      {primaryButtons.map((btn) => (
                        <Button
                          key={btn.key}
                          size="sm"
                          variant="outline"
                          onClick={() => btn.action(row)}
                        >
                          {btn.label}
                        </Button>
                      ))}
                      {secondaryButtons.length > 0 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {secondaryButtons.map((btn) => (
                              <DropdownMenuItem
                                key={btn.key}
                                onClick={() => btn.action(row)}
                              >
                                {btn.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </CardFooter>
                  )}
                </Card>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="w-full overflow-x-auto rounded-md border"
          >
            <Table className="min-w-[800px] w-full">
              {caption && <TableCaption>{caption}</TableCaption>}
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={String(col.key)}>{col.label}</TableHead>
                  ))}
                  {actionButtons.length > 0 && <TableHead>Aksi</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={String(col.key)}
                        className="max-w-[250px] truncate"
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : String(row[col.key])}
                      </TableCell>
                    ))}
                    {actionButtons.length > 0 && (
                      <TableCell className="flex flex-wrap gap-2">
                        {actionButtons.map((btn) => (
                          <Button
                            key={btn.key}
                            size="sm"
                            variant="outline"
                            onClick={() => btn.action(row)}
                          >
                            {btn.label}
                          </Button>
                        ))}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
