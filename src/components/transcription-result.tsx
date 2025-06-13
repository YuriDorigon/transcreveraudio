"use client";

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TranscriptionResultProps {
  text: string;
}

export function TranscriptionResult({ text }: TranscriptionResultProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Transcrição copiada para a área de transferência.",
      });
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar a transcrição.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transcricao.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Download Iniciado",
        description: "O arquivo transcricao.txt está sendo baixado.",
      });
    } catch (err) {
      toast({
        title: "Erro no Download",
        description: "Não foi possível baixar a transcrição.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mt-8 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-headline">Transcrição Gerada</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          readOnly
          rows={15}
          className="w-full p-4 border rounded-md shadow-inner bg-background text-sm leading-relaxed resize-none"
          aria-label="Texto da transcrição"
        />
        <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
          <Button onClick={handleCopy} variant="outline" className="w-full sm:w-auto">
            <Copy className="mr-2 h-4 w-4" />
            Copiar Texto
          </Button>
          <Button onClick={handleDownload} variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Baixar (.txt)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
