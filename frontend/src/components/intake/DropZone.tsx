"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";

interface DropZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function DropZone({ file, onFileChange }: DropZoneProps) {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        onFileChange(droppedFile);
      }
    },
    [onFileChange]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        onFileChange(selectedFile);
      }
    },
    [onFileChange]
  );

  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-dashed p-4 transition-colors cursor-pointer sm:p-8 xl:p-12",
        isDragging
          ? "border-white bg-white/5"
          : file
            ? "border-zinc-600 bg-zinc-900/50"
            : "border-zinc-700 hover:border-zinc-500"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      {file ? (
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <FileImage className="w-8 h-8 text-zinc-400" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-zinc-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFileChange(null);
            }}
            className="shrink-0 rounded p-2 hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="text-center space-y-3">
          <Upload className="w-10 h-10 mx-auto text-zinc-500" />
          <div>
            <p className="text-sm text-zinc-400">
              {t("intake.dropzone.title")}
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              {t("intake.dropzone.subtitle")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
