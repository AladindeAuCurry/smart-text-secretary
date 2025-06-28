
import React, { useRef, useState } from 'react';
import { Upload, FileAudio, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const audioFile = files.find(file => 
      file.type.startsWith('audio/') || 
      /\.(mp3|wav|m4a|ogg|flac|aac|wma)$/i.test(file.name)
    );
    
    if (!audioFile) {
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner un fichier audio (MP3, WAV, M4A, OGG, FLAC, AAC)",
        variant: "destructive",
      });
      return;
    }

    if (audioFile.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 100MB",
        variant: "destructive",
      });
      return;
    }

    onFileUpload(audioFile);
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer ${
          isDragOver
            ? 'border-purple-400 bg-purple-500/10 scale-105'
            : 'border-slate-600 bg-white/5 hover:border-slate-500 hover:bg-white/10'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac,.aac,.wma"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="space-y-6">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            isDragOver ? 'bg-purple-500/20' : 'bg-slate-700/50'
          }`}>
            {isDragOver ? (
              <Upload className="w-10 h-10 text-purple-400 animate-bounce" />
            ) : (
              <FileAudio className="w-10 h-10 text-slate-400" />
            )}
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              {isDragOver ? 'Déposez votre fichier ici' : 'Glissez votre fichier audio'}
            </h3>
            <p className="text-slate-400 mb-4">
              ou cliquez pour sélectionner un fichier
            </p>
            <p className="text-sm text-slate-500">
              Formats supportés : MP3, WAV, M4A, OGG, FLAC, AAC (max 100MB)
            </p>
          </div>
        </div>

        {/* Animated border effect */}
        <div className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${
          isDragOver ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 animate-pulse"></div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-slate-400">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>Traitement 100% local avec IA Whisper - Aucune donnée envoyée sur internet</span>
        </div>
      </div>
    </div>
  );
};
