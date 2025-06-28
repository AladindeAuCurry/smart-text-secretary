
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

  const transcribeAudio = async (audioFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Vérifier si le navigateur supporte l'API Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        reject(new Error('Votre navigateur ne supporte pas la reconnaissance vocale. Utilisez Chrome ou Edge.'));
        return;
      }

      // Créer un élément audio pour lire le fichier
      const audio = new Audio();
      const recognition = new SpeechRecognition();
      
      // Configuration de la reconnaissance vocale
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR'; // Langue française par défaut
      
      let finalTranscript = '';
      let isRecognitionActive = false;

      recognition.onstart = () => {
        console.log('Transcription démarrée');
        isRecognitionActive = true;
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        console.log('Transcription en cours:', finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Erreur de reconnaissance:', event.error);
        if (event.error === 'not-allowed') {
          reject(new Error('Accès au microphone refusé. Veuillez autoriser l\'accès au microphone.'));
        } else {
          reject(new Error(`Erreur de transcription: ${event.error}`));
        }
      };

      recognition.onend = () => {
        console.log('Transcription terminée');
        isRecognitionActive = false;
        if (finalTranscript.trim()) {
          resolve(finalTranscript.trim());
        } else {
          reject(new Error('Aucun texte transcrit. Vérifiez que le fichier audio contient de la parole claire.'));
        }
      };

      // Lire le fichier audio
      const url = URL.createObjectURL(audioFile);
      audio.src = url;
      
      audio.onloadeddata = () => {
        console.log('Audio chargé, démarrage de la transcription');
        recognition.start();
        audio.play().catch(e => {
          console.error('Erreur lecture audio:', e);
          reject(new Error('Impossible de lire le fichier audio'));
        });
      };

      audio.onended = () => {
        console.log('Audio terminé');
        setTimeout(() => {
          if (isRecognitionActive) {
            recognition.stop();
          }
        }, 1000); // Attendre 1 seconde après la fin de l'audio
        URL.revokeObjectURL(url);
      };

      audio.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier audio'));
        URL.revokeObjectURL(url);
      };
    });
  };

  const handleFileUpload = async (file: File) => {
    setAudioFile(file);
    setIsTranscribing(true);
    
    try {
      console.log('Début de la transcription du fichier:', file.name);
      const transcribedText = await transcribeAudio(file);
      
      const transcriptionData = {
        originalText: transcribedText
      };
      
      setTranscriptionData(transcriptionData);
      toast({
        title: "Transcription réussie !",
        description: "Votre fichier audio a été transcrit avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la transcription:', error);
      toast({
        title: "Erreur de transcription",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de la transcription.",
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
                  Transformez vos enregistrements audio en texte intelligent avec la reconnaissance vocale gratuite
                </p>
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-300">
                    💡 Utilise la reconnaissance vocale gratuite de votre navigateur (Chrome/Edge recommandé)
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
                  <p className="text-slate-400">Traitement de votre fichier audio avec la reconnaissance vocale gratuite</p>
                  <p className="text-sm text-slate-500 mt-2">Assurez-vous d'autoriser l'accès au microphone si demandé</p>
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
