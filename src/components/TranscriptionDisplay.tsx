
import React, { useState } from 'react';
import { Copy, Download, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { TranscriptionData } from '@/pages/Index';

interface TranscriptionDisplayProps {
  transcriptionData: TranscriptionData;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ transcriptionData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: "Le texte a été copié dans le presse-papier",
    });
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatText = (text: string) => {
    return text.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Transcription originale */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <span>📝</span>
              <span>Transcription originale</span>
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyToClipboard(transcriptionData.originalText)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                title="Copier"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => downloadText(transcriptionData.originalText, 'transcription.txt')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                title="Télécharger"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                title={isExpanded ? "Réduire" : "Étendre"}
              >
                {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className={`text-slate-300 leading-relaxed transition-all duration-300 ${
            isExpanded ? 'max-h-none' : 'max-h-40 overflow-hidden'
          }`}>
            {formatText(transcriptionData.originalText)}
          </div>
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none"></div>
          )}
        </div>
      </div>

      {/* Texte traité */}
      {transcriptionData.processedText && (
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <span>✨</span>
              <span>Texte mis au propre</span>
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyToClipboard(transcriptionData.processedText!)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => downloadText(transcriptionData.processedText!, 'texte-propre.txt')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-green-100 leading-relaxed">
            {formatText(transcriptionData.processedText)}
          </div>
        </div>
      )}

      {/* Résumé */}
      {transcriptionData.summary && (
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <span>📊</span>
              <span>Résumé</span>
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => copyToClipboard(transcriptionData.summary!)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="text-blue-100 leading-relaxed">
            {formatText(transcriptionData.summary)}
          </div>
        </div>
      )}

      {/* Thèmes */}
      {transcriptionData.themes && (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <span>🧠</span>
            <span>Thèmes principaux</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {transcriptionData.themes.map((theme, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3 text-purple-100">
                {theme}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions à faire */}
      {transcriptionData.actionItems && (
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <span>✅</span>
            <span>Actions à réaliser</span>
          </h3>
          <div className="space-y-2">
            {transcriptionData.actionItems.map((action, index) => (
              <div key={index} className="flex items-start space-x-3 text-orange-100">
                <span className="text-orange-400 mt-1">•</span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Citations clés */}
      {transcriptionData.keyQuotes && (
        <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <span>💬</span>
            <span>Citations clés</span>
          </h3>
          <div className="space-y-4">
            {transcriptionData.keyQuotes.map((quote, index) => (
              <blockquote key={index} className="border-l-4 border-yellow-400 pl-4 text-yellow-100 italic">
                "{quote}"
              </blockquote>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
