
import { useState, useCallback } from 'react';
import { pipeline, AutomaticSpeechRecognitionPipeline } from '@huggingface/transformers';

export const useWhisperTranscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [transcriber, setTranscriber] = useState<AutomaticSpeechRecognitionPipeline | null>(null);
  const [progress, setProgress] = useState(0);

  const initializeModel = useCallback(async () => {
    if (transcriber) return transcriber;

    setIsModelLoading(true);
    setProgress(0);

    try {
      console.log('Initialisation du modèle Whisper...');
      
      const pipe = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-tiny',
        {
          progress_callback: (data: any) => {
            if (data.status === 'downloading') {
              const percent = Math.round((data.loaded / data.total) * 100);
              setProgress(percent);
              console.log(`Téléchargement du modèle: ${percent}%`);
            }
          }
        }
      );

      setTranscriber(pipe);
      console.log('Modèle Whisper initialisé avec succès');
      return pipe;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du modèle:', error);
      throw new Error('Impossible d\'initialiser le modèle de transcription');
    } finally {
      setIsModelLoading(false);
      setProgress(0);
    }
  }, [transcriber]);

  const transcribeAudio = useCallback(async (audioFile: File): Promise<string> => {
    setIsLoading(true);

    try {
      console.log('Début de la transcription:', audioFile.name);
      
      // Initialiser le modèle si nécessaire
      const pipe = await initializeModel();
      
      // Convertir le fichier audio en ArrayBuffer
      const arrayBuffer = await audioFile.arrayBuffer();
      
      // Transcrire l'audio
      const result = await pipe(arrayBuffer);
      
      console.log('Transcription terminée:', result);
      
      if (result && result.text) {
        return result.text.trim();
      } else {
        throw new Error('Aucun texte transcrit trouvé');
      }
      
    } catch (error) {
      console.error('Erreur lors de la transcription:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erreur inconnue lors de la transcription');
      }
    } finally {
      setIsLoading(false);
    }
  }, [initializeModel]);

  return {
    transcribeAudio,
    isLoading,
    isModelLoading,
    progress,
    isModelReady: !!transcriber
  };
};
