
import React from 'react';
import { Brain, Download } from 'lucide-react';

interface ModelLoadingProgressProps {
  progress: number;
  isVisible: boolean;
}

export const ModelLoadingProgress: React.FC<ModelLoadingProgressProps> = ({ 
  progress, 
  isVisible 
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <Brain className="w-16 h-16 text-purple-400 animate-pulse" />
            <Download className="w-6 h-6 text-blue-400 absolute -bottom-1 -right-1 animate-bounce" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-white">
            Préparation de l'IA Whisper
          </h3>
          <p className="text-slate-300">
            Téléchargement du modèle de transcription haute précision...
          </p>
          <p className="text-sm text-slate-400">
            Cette opération ne se fait qu'une seule fois
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-400">
            {progress}% - {progress < 50 ? 'Téléchargement...' : progress < 90 ? 'Installation...' : 'Finalisation...'}
          </p>
        </div>
      </div>
    </div>
  );
};
