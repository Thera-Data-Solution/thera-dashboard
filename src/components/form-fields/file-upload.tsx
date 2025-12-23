"use client";

import { AlertCircleIcon, XIcon, CloudUpload, File } from "lucide-react";
import {
  formatBytes,
  useFileUpload,
} from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file.type;
  if (fileType.startsWith("image/")) {
    // return preview
    return (
      <div className="aspect-square size-10 overflow-hidden rounded-md">
        <img
          src={URL.createObjectURL(file.file as Blob)}
          className="object-fill"
        />
      </div>
    );
  }
  return (
    <div className="aspect-square size-10 flex items-center justify-center overflow-hidden rounded-full">
      <File className="size-5 opacity-60" />
    </div>
  );
};

export function FileUpload({
  maxFiles,
  maxSize,
  placeholder,
  required,
  setValue,
  accept,
  name,
  disabled,
  defaultUrl, // <= API preview
}: {
  maxFiles: number;
  maxSize: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  setValue: (...args: any) => void;
  accept?: string;
  name: string;
  defaultUrl?: string; // <= tambahin ini
}) {
  const [initialPreview, setInitialPreview] = useState<string | null>(defaultUrl ?? null);
  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: maxFiles > 1,
    maxFiles,
    maxSize,
    accept,
    onFilesChange: (files) => {
      // user upload file, jadi preview existing dihapus
      setInitialPreview(null);

      // For single upload we only store the first file in form state so RHF receives a File, not an array.
      const payload = maxFiles > 1 ? files.map((file) => file.file) : files[0]?.file ?? null;

      setValue(name, payload, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },

  });

  useEffect(() => {
    if (defaultUrl) {
      setInitialPreview(defaultUrl);
    }
  }, [defaultUrl]);


  return (
    <div className="flex flex-col gap-2 pb-2">
      {/* Drop area */}
      <div
        role="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-32 flex-col items-center justify-center rounded-md border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px] hover:cursor-pointer"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload files"
          required={required}
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="bg-secondary mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CloudUpload className="size-4 opacity-60" />
          </div>
          {/* <p className="mb-1.5 text-sm font-medium">
            Upload
          </p> */}
          <p className="text-foreground font-medium text-sm mb-2">
            Drag & drop or click to browse
          </p>
          <div className="text-muted-foreground/70 flex flex-wrap justify-center gap-1 text-xs">
            {placeholder}
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}

      {/* File list */}
      {initialPreview && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 rounded-lg border p-2 pe-3">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <div className="aspect-square size-10 overflow-hidden rounded-md">
                <img
                  src={initialPreview}
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-[11px] font-medium max-w-[200px]">
                  Existing Image
                </p>
                <p className="text-muted-foreground text-xs">Preview</p>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
              onClick={() => {
                setInitialPreview(null);
                // Mark as removed so backend can drop existing image
                setValue(name, null, { shouldValidate: true, shouldDirty: true });
              }}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                {getFileIcon(file)}
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="truncate text-[11px] font-medium max-w-[200px]">
                    {file.file.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatBytes(file.file.size)}
                  </p>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                onClick={() => removeFile(file.id)}
                aria-label="Remove file"
              >
                <XIcon className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ))}

          {/* Remove all files button */}
          {files.length > 1 && (
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={clearFiles}>
                Remove all files
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
