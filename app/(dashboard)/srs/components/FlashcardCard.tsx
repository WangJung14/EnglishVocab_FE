'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Rotate3d } from 'lucide-react';
import { Flashcard } from '../types';
import '../srs.css';

interface FlashcardCardProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  onSpeak: (text: string, e?: React.MouseEvent) => void;
}

export default function FlashcardCard({ card, isFlipped, onFlip, onSpeak }: FlashcardCardProps) {
  return (
    <div 
      className="w-full max-w-xl aspect-[4/3] perspective-1000 cursor-pointer group"
      onClick={onFlip}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 260 }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border-4 border-white dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center ring-1 ring-black/5 dark:ring-white/5">
          <div className="absolute top-6 right-8 text-sky-500/20 group-hover:text-sky-500/40 transition-colors">
            <Rotate3d size={48} strokeWidth={1.5} />
          </div>
          
          <div className="space-y-6 flex flex-col items-center">
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-slate-800 dark:text-white">
              {card.frontText}
            </h2>
            
            <button
              onClick={(e) => onSpeak(card.frontText, e)}
              className="p-4 rounded-full bg-sky-50 dark:bg-sky-950/30 text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all active:scale-95 border-2 border-sky-100/50 dark:border-sky-500/20"
              aria-label="Speak word"
            >
              <Volume2 size={32} />
            </button>
          </div>
          
          <p className="absolute bottom-10 text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
            Click to flip
          </p>
        </div>

        {/* Back Side (Rotated 180deg) */}
        <div 
          className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border-4 border-sky-200 dark:border-sky-900 flex flex-col items-center justify-center p-8 text-center rotate-y-180 ring-1 ring-black/5 dark:ring-white/5"
        >
          <div className="w-full max-w-sm space-y-8 overflow-y-auto max-h-full py-4 scrollbar-hide">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 mb-2 block bg-sky-50 dark:bg-sky-950/40 px-3 py-1 rounded-full w-fit mx-auto">
                DEFINITION
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white leading-tight">
                {card.backText}
              </h3>
            </div>

            {card.example && (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border-l-4 border-sky-500 text-left relative overflow-hidden group/ex">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/ex:opacity-30 transition-opacity">
                  <Volume2 size={40} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block">
                  EXAMPLE
                </span>
                <p className="text-base md:text-lg italic font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{card.example}"
                </p>
              </div>
            )}
          </div>

          <div className="absolute bottom-8 right-8 text-sky-500/20">
             <Rotate3d size={32} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
