"use client";

import React, { useState, useEffect } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer';
import { FileUpload } from '@/components/file-upload';
import { TranscriptionResult } from '@/components/transcription-result';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { transcribeAudio, TranscribeAudioInput } from '@/ai/flows/transcribe-audio';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (file.type !== 'audio/mpeg') {
        handleFileError("Tipo de arquivo inválido. Por favor, envie um arquivo .mp3.");
        return;
    }
    setSelectedFile(file);
    setFileName(file.name);
    setTranscription(null); // Clear previous transcription
  };

  const handleFileError = (message: string) => {
    toast({
      title: 'Erro no Upload',
      description: message,
      variant: 'destructive',
    });
    setSelectedFile(null);
    setFileName(null);
  };

  const handleStartTranscription = async () => {
    if (!selectedFile) {
      toast({
        title: 'Nenhum arquivo selecionado',
        description: 'Por favor, selecione um arquivo MP3 para transcrever.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setTranscription(null);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = async () => {
      try {
        const audioDataUri = reader.result as string;
        const input: TranscribeAudioInput = { audioDataUri };
        const result = await transcribeAudio(input);
        setTranscription(result.transcription);
        toast({
          title: 'Transcrição Concluída!',
          description: 'Seu áudio foi transcrito com sucesso.',
        });
      } catch (error) {
        console.error('Transcription error:', error);
        toast({
          title: 'Erro na Transcrição',
          description: 'Ocorreu um erro ao transcrever o áudio. Verifique o console para mais detalhes ou tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      toast({
        title: 'Erro ao Ler Arquivo',
        description: 'Não foi possível ler o arquivo selecionado.',
        variant: 'destructive',
      });
      setIsLoading(false);
    };
  };
  
  // Effect to manage body class for centering content
  useEffect(() => {
    document.body.classList.add('flex', 'flex-col');
    return () => {
      document.body.classList.remove('flex', 'flex-col');
    };
  }, []);


  return (
    <>
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <Card className="w-full max-w-xl p-6 sm:p-8 shadow-xl rounded-xl">
          <CardHeader className="text-center p-0 mb-6">
            <CardTitle className="text-2xl font-headline text-foreground">Transforme Áudio em Texto</CardTitle>
            <CardDescription className="text-md text-muted-foreground mt-2">
              Envie um arquivo MP3 e receba a transcrição em texto, tudo em português do Brasil.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6 p-0">
            <FileUpload 
              onFileSelect={handleFileSelect} 
              onFileError={handleFileError} 
              fileName={fileName}
            />

            {selectedFile && (
              <Button
                onClick={handleStartTranscription}
                disabled={isLoading}
                className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 px-6 rounded-lg shadow-md transition-transform hover:scale-105"
                aria-label="Iniciar transcrição do áudio selecionado"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Iniciar Transcrição'
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {transcription && !isLoading && (
          <TranscriptionResult text={transcription} />
        )}
      </main>
      <AppFooter />
    </>
  );
}
