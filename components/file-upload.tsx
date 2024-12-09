'use client'

import { ChangeEvent, useState } from 'react'
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  label: string
}

export function FileUpload({ onFileSelect, label }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onFileSelect(file)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => document.getElementById(label)?.click()}
        variant="outline"
      >
        {fileName || `Upload ${label}`}
      </Button>
      <input
        type="file"
        id={label}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  )
}

