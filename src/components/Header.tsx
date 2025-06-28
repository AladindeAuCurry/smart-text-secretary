
import React from 'react';
import { Mic, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Mic className="w-8 h-8 text-purple-400" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Secretary</h1>
              <p className="text-sm text-slate-400">AI-Powered Audio Transcription</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm text-slate-300">
            <span className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>IA Ready</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
