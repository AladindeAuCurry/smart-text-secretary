
import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { TranscriptionDisplay } from '@/components/TranscriptionDisplay';
import { ActionButtons } from '@/components/ActionButtons';
import { Header } from '@/components/Header';
import { toast } from '@/hooks/use-toast';

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
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionData, setTranscriptionData] = useState<TranscriptionData | null>(null);

  const handleFileUpload = async (file: File) => {
    setAudioFile(file);
    setIsTranscribing(true);
    
    try {
      // Simulation de la transcription (remplacer par l'API réelle)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockTranscription = {
        originalText: `Bonjour et bienvenue dans ce podcast sur l'intelligence artificielle. Aujourd'hui nous allons parler des dernières avancées en matière de reconnaissance vocale et de traitement du langage naturel. 

L'IA a révolutionné notre façon de travailler, particulièrement dans le domaine de la transcription automatique. Les modèles comme Whisper d'OpenAI permettent maintenant une précision remarquable même avec des accents variés.

Nous devons également discuter des implications éthiques de ces technologies. Il est crucial de maintenir la transparence et de respecter la vie privée des utilisateurs. 

Pour la suite, nous prévoyons d'organiser une réunion la semaine prochaine pour définir les prochaines étapes de notre projet. N'oubliez pas de préparer vos présentations et de revoir le budget alloué.

Comme le disait Steve Jobs : "L'innovation distingue un leader d'un suiveur". Cette citation résume parfaitement l'esprit entrepreneurial qui doit nous guider.`
      };
      
      setTranscriptionData(mockTranscription);
      toast({
        title: "Transcription réussie !",
        description: "Votre fichier audio a été transcrit avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur de transcription",
        description: "Une erreur s'est produite lors de la transcription.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
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
                  Transformez vos enregistrements audio en texte intelligent avec des actions automatisées
                </p>
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
                      setIsTranscribing(false);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              {isTranscribing && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold text-white mb-2">Transcription en cours...</h3>
                  <p className="text-slate-400">Traitement de votre fichier audio avec l'IA</p>
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
