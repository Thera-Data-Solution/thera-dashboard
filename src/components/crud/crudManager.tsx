"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet"
import { Loader2, Plus, Trash2, Edit } from "lucide-react"
import { toast } from "sonner"
import { authApi } from "@/api"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area" // Pastikan ini diinstal dan berfungsi dengan baik

interface FieldConfig {
  name: string
  label: string
  type: "text" | "number" | "file" | "textarea" | "checkbox"
  required?: boolean
}

interface CrudManagerProps {
  title: string
  endpoint: string
  fields: FieldConfig[]
  useFormData?: boolean
  hasPagination?: boolean
}

export function CrudManager({
  title,
  endpoint,
  fields,
  useFormData = false,
  hasPagination = false,
}: CrudManagerProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function fetchData() {
    setLoading(true)
    try {
      const res = await authApi({
        url: endpoint,
        method: "GET"
      })
      if (hasPagination) {
        setData(res.data.data);
      } else {
        setData(res.data);
      }
    } catch (e) {
      toast.error("Gagal mengambil data.")
      console.error("Fetch data error:", e);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  function renderInput(f: FieldConfig) {
    switch (f.type) {
      case "textarea":
        return (
          <Textarea
            id={f.name}
            name={f.name}
            required={f.required}
            value={formData[f.name] ?? ""}
            onChange={handleChange}
            placeholder={`Masukkan ${f.label.toLowerCase()}`}
            className="min-h-[80px]"
          />
        )
      case "checkbox":{
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={f.name}
              name={f.name}
              checked={formData[f.name] ?? false}
              onCheckedChange={(checked: boolean) => handleCheckboxChange(f.name, checked)}
            />
            <label
              htmlFor={f.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {f.label}
            </label>
          </div>
        )}
      case "file":{
        const existingFileUrl = editing && editing[f.name] && typeof editing[f.name] === 'string' ? editing[f.name] : null;

        return (
          <div className="space-y-2">
            {existingFileUrl && editing && !formData[f.name] && (
              <div className="text-sm text-gray-500">File saat ini:</div>
            )}
            {/* Tampilkan pratinjau file yang ada (jika ini URL gambar) */}
            {existingFileUrl && editing && !formData[f.name] && (
              <img src={existingFileUrl} alt="File lama" className="h-20 w-20 rounded object-cover border" />
            )}
            {/* Input File: Hapus properti 'value' */}
            <Input
              id={f.name}
              type="file"
              name={f.name}
              required={f.required && !editing} // Hanya wajib jika Tambah Baru (bukan Edit)
              onChange={handleChange}
              className="w-full"
            />
            {editing && !formData[f.name] && (
              <p className="text-xs text-muted-foreground">Biarkan kosong untuk mempertahankan file lama.</p>
            )}
          </div>
        )}
      default:
        // Input tipe "text", "number", atau lainnya
        return (
          <Input
            id={f.name}
            type={f.type}
            name={f.name}
            required={f.required}
            value={formData[f.name] ?? ""}
            onChange={handleChange}
            placeholder={`Masukkan ${f.label.toLowerCase()}`}
            className="w-full"
          />
        )
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type, files } = e.target as any
    if (type === "file") {
      setFormData({ ...formData, [name]: files?.[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  function handleCheckboxChange(name: string, checked: boolean) {
    setFormData({ ...formData, [name]: checked })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    const method = editing ? "PUT" : "POST"
    const url = editing ? `${endpoint}/${editing.id}` : endpoint

    let body: any

    if (useFormData) {
      const fd = new FormData()
      for (const key in formData) {
        if (fields.find(f => f.name === key)?.type === "file") {
          if (formData[key] instanceof File) {
            fd.append(key, formData[key])
          }
        } else {
          fd.append(key, formData[key])
        }
      }
      body = fd
    } else {
      body = formData
    }

    try {
      const res = await authApi({
        url,
        method: method,
        data: body,
        headers: {
          "Content-Type": useFormData ? "multipart/form-data" : "application/json",
        }
      })

      if (res.status >= 400) throw new Error()
      toast.success(editing ? "Data berhasil diperbarui!" : "Data berhasil ditambahkan!")
      setOpen(false)
      setEditing(null)
      setFormData({})
      fetchData()
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Gagal menyimpan data.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus item ini?")) return
    try {
      await authApi({
        url: `${endpoint}/${id}`,
        method: "DELETE",
      })
      toast.success("Data berhasil dihapus!")
      fetchData()
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Gagal menghapus data.")
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setEditing(null)
      setFormData({})
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button onClick={() => handleOpenChange(true)}>
          <Plus className="w-4 h-4 mr-2" /> Tambah {title}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-6">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {fields.map((f) => (
                  <TableHead key={f.name}>{f.label}</TableHead>
                ))}
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={fields.length + 1} className="text-center py-4 text-gray-500">
                    Tidak ada data ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id}>
                    {fields.map((f) => (
                      <TableCell key={f.name}>
                        {f.type === "file" && item[f.name] ? (
                          <img
                            src={item[f.name]}
                            alt={f.label}
                            className="h-12 w-12 rounded object-cover border"
                          />
                        ) : f.type === "checkbox" ? (
                          <Checkbox checked={item[f.name]} disabled />
                        ) : (
                          item[f.name]?.toString() ?? "-"
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditing(item)
                          setFormData(item)
                          handleOpenChange(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Sheet open={open} onOpenChange={handleOpenChange}>
        {/* Konten Sheet itu sendiri harus punya tinggi dan flex agar ScrollArea bisa berfungsi */}
        <SheetContent className="flex flex-col sm:max-w-md h-full"> {/* Hapus pr-0, biarkan Shadcn SheetContent mengatur paddingnya */}
          <SheetHeader className="pb-4"> {/* Tambahkan padding bottom agar ada jarak dengan form */}
            <SheetTitle>{editing ? "Edit" : "Tambah"} {title}</SheetTitle>
            <SheetDescription>
              {editing ? "Perbarui detail untuk item ini." : "Buat item baru dengan mengisi detail di bawah."}
            </SheetDescription>
          </SheetHeader>

          {/* Wrapper untuk ScrollArea agar padding konsisten di samping */}
          <div className="flex-grow overflow-hidden"> {/* flex-grow agar mengisi ruang, overflow-hidden untuk mencegah scrollbar ganda */}
            <ScrollArea className="h-full pr-6"> {/* Berikan tinggi penuh pada ScrollArea, tambahkan padding kanan untuk scrollbar */}
              <div className="m-6">
                <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                  {fields.map((f) => (
                    <div key={f.name} className="space-y-1">
                      <Label htmlFor={f.name}>{f.label}{f.required && <span className="text-red-500">*</span>}</Label>
                      {/* Panggil fungsi renderInput di sini */}
                      {renderInput(f)}
                    </div>
                  ))}
                </form>
              </div>
            </ScrollArea>
          </div>
          <SheetFooter className="pt-4"> {/* Hapus pr-6, biarkan SheetFooter mengatur paddingnya */}
            <Button variant="outline" type="button" onClick={() => handleOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}