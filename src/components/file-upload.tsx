"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileAudio } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileError: (message: string) => void;
  acceptedFileType?: string;
  fileName: string | null;
}

export function FileUpload({ onFileSelect, onFileError, acceptedFileType = ".mp3", fileName }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setIsDragging(false);
    if (fileRejections.length > 0) {
      onFileError(`Tipo de arquivo inválido. Por favor, envie um arquivo ${acceptedFileType}.`);
      return;
    }
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect, onFileError, acceptedFileType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/mpeg': [acceptedFileType] },
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div
        {...getRootProps()}
        className={`w-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive || isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70'}`}
      >
        <input {...getInputProps()} aria-label="Upload de arquivo MP3" />
        <UploadCloud className={`w-16 h-16 mb-4 ${isDragActive || isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
        {isDragActive ? (
          <p className="text-primary font-semibold">Solte o arquivo aqui...</p>
        ) : (
          <p className="text-center text-muted-foreground">
            Arraste e solte um arquivo MP3 aqui, ou
            <Button variant="link" className="p-0 h-auto ml-1 text-accent">clique para selecionar</Button>
          </p>
        )}
      </div>
      {fileName && (
        <div className="w-full mt-2 p-3 bg-secondary rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileAudio className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">{fileName}</span>
          </div>
        </div>
      )}
    </div>
  );
}
