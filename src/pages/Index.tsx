
import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { ActionButtons } from '@/components/ActionButtons';
import { Header } from '@/components/Header';
import { ModelLoadingProgress } from '@/components/ModelLoadingProgress';
import { toast } from '@/hooks/use-toast';
import { useWhisperTranscription } from '@/hooks/useWhisperTranscription';

export interface TranscriptionData {
  originalText: string;
  processedText?: string;
  summary?: string;
  themes?: string[];
  actionItems?: string[];
  keyQuotes?: string[];
}

const Index = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcriptionData, setTranscriptionData] = useState<TranscriptionData | null>(null);
  
  const { 
    transcribeAudio, 
    isLoading: isTranscribing, 
    isModelLoading, 
    progress 
  } = useWhisperTranscription();

  const handleFileUpload = async (file: File) => {
    setAudioFile(file);
    
    try {
      console.log('Début de la transcription du fichier:', file.name);
      const transcribedText = await transcribeAudio(file);
      
      const transcriptionData = {
        originalText: transcribedText
      };
      
      setTranscriptionData(transcriptionData);
      toast({
        title: "Transcription réussie !",
        description: "Votre fichier audio a été transcrit avec succès par l'IA Whisper.",
      });
    } catch (error) {
      console.error('Erreur lors de la transcription:', error);
      toast({
        title: "Erreur de transcription",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de la transcription.",
        variant: "destructive",
      });
    }
  };

  const handleProcessText = (type: string, result: string) => {
    if (!transcriptionData) return;
    
    const updatedData = { ...transcriptionData };
    
    switch (type) {
      case 'clean':
        updatedData.processedText = result;
        break;
      case 'summary':
        updatedData.summary = result;
        break;
      case 'themes':
        updatedData.themes = result.split('\n').filter(theme => theme.trim());
        break;
      case 'actions':
        updatedData.actionItems = result.split('\n').filter(action => action.trim());
        break;
      case 'quotes':
        updatedData.keyQuotes = result.split('\n').filter(quote => quote.trim());
        break;
    }
    
    setTranscriptionData(updatedData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {!audioFile && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-6">
                  Secretary
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Transcription audio intelligente avec IA Whisper - 100% gratuit et local
                </p>
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-sm text-green-300">
                    🚀 Powered by OpenAI Whisper - Précision professionnelle, entièrement gratuit
                  </p>
                </div>
              </div>
              
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          )}

          {audioFile && (
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  📁 Fichier sélectionné
                </h2>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">{audioFile.name}</span>
                  <button
                    onClick={() => {
                      setAudioFile(null);
                      setTranscriptionData(null);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <ModelLoadingProgress progress={progress} isVisible={isModelLoading} />

              {isTranscribing && !isModelLoading && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold text-white mb-2">Transcription en cours...</h3>
                  <p className="text-slate-400">L'IA Whisper analyse votre fichier audio</p>
                  <p className="text-sm text-slate-500 mt-2">Traitement local ultra-sécurisé</p>
                </div>
              )}

              {transcriptionData && (
                <>
                  <TranscriptionDisplay transcriptionData={transcriptionData} />
                  <ActionButtons 
                    originalText={transcriptionData.originalText}
                    onProcessText={handleProcessText}
                  />
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
