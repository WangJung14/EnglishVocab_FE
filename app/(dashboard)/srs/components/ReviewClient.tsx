'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ChevronRight, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Flashcard, ReviewRating } from '../types';
import FlashcardCard from './FlashcardCard';

interface ReviewClientProps {
  initialCards: Flashcard[];
}

export default function ReviewClient({ initialCards }: ReviewClientProps) {
  const router = useRouter();
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex) / (cards.length)) * 100;

  const speak = useCallback((text: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!window.speechSynthesis) return;

    // Cancel existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleFlip = useCallback(() => {
    if (isFinished) return;
    
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    
    if (nextFlipped && currentCard) {
      // Speak when flipped to back or when show answer is clicked
      speak(currentCard.frontText);
    }
  }, [isFlipped, isFinished, currentCard, speak]);

  const handleRate = useCallback(async (rating: ReviewRating) => {
    if (isSubmitting || isFinished) return;
    
    setIsSubmitting(true);
    
    try {
      // API Base is http://localhost:8080/api/v1
      // We don't have a shared fetch function here, but we'll use a local one or fetch directly
      // In a real app, this would be a server action or a specialized client fetcher
      // For now, we simulate the POST to /srs/review/{id}
      /* 
      await fetch(`http://localhost:8080/api/v1/srs/review/${currentCard.flashcardId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating })
      });
      */
      
      // Artificial delay for feedback
      await new Promise(resolve => setTimeout(resolve, 300));

      if (currentIndex < cards.length - 1) {
        setIsFlipped(false);
        // Small delay to let card flip back before changing content
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setIsSubmitting(false);
        }, 150);
      } else {
        setIsFinished(true);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      setIsSubmitting(false);
    }
  }, [currentIndex, cards.length, isSubmitting, isFinished]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      }

      if (isFlipped) {
        if (e.key === '1') handleRate('AGAIN');
        if (e.key === '2') handleRate('HARD');
        if (e.key === '3') handleRate('GOOD');
        if (e.key === '4') handleRate('EASY');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isFinished, handleFlip, handleRate]);

  // Initial Speak
  useEffect(() => {
    if (currentCard && currentIndex === 0 && !isFlipped) {
        // speak(currentCard.frontText); // Optional: speak immediately on first card
    }
  }, [currentCard, currentIndex, isFlipped, speak]);

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-background overflow-hidden relative">
        {/* Confetti-like background effects could be added here */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[32px] p-10 text-center shadow-xl border-2 border-sky-100 dark:border-sky-900 z-10"
        >
          <div className="w-24 h-24 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-inner">
            <CheckCircle2 size={56} strokeWidth={2.5} />
          </div>
          
          <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-4">
            Daily Goal Reached! 🎉
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 font-medium mb-10 leading-relaxed">
            You've completed all your due flashcards for today. Consistent practice is the key to long-term memory!
          </p>
          
          <Button 
            onClick={() => router.push('/dashboard')}
            className="w-full h-14 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-black text-lg shadow-[0_6px_0_0_#0284c7] active:shadow-none active:translate-y-1 transition-all"
          >
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col pt-6 pb-12 px-4 md:px-8">
      {/* Top Header & Progress */}
      <div className="max-w-4xl mx-auto w-full mb-12 flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <button 
                onClick={() => router.push('/dashboard')}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all shadow-sm"
            >
                <X size={24} strokeWidth={2.5} />
            </button>
            
            <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
                    TODAY'S PROGRESS
                </span>
                <span className="text-lg font-black text-sky-500">
                    {currentIndex} / {cards.length}
                </span>
            </div>

            <div className="w-12 h-12" /> {/* Spacer */}
        </div>

        <Progress value={progress} className="h-3 bg-slate-200 dark:bg-slate-800 [&>div]:bg-sky-500 rounded-full shadow-inner" />
      </div>

      {/* Main Card Area */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentCard && (
            <motion.div
              key={currentCard.flashcardId}
              initial={{ x: isFinished ? 0 : 300, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -300, opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="w-full flex justify-center"
            >
              <FlashcardCard 
                card={currentCard} 
                isFlipped={isFlipped} 
                onFlip={handleFlip}
                onSpeak={speak}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="max-w-2xl mx-auto w-full mt-12">
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div
              key="show-answer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="flex justify-center"
            >
              <Button
                onClick={handleFlip}
                className="w-full md:w-80 h-16 rounded-[24px] bg-slate-800 dark:bg-slate-100 dark:text-slate-900 text-white font-black text-xl shadow-[0_6px_0_0_#1e293b] dark:shadow-[0_6px_0_0_#cbd5e1] active:shadow-none active:translate-y-1 transition-all group"
              >
                SHOW ANSWER
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="ratings"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <RatingButton 
                label="Again" 
                sub="< 1m" 
                color="bg-rose-500" 
                shadow="#be123c" 
                onClick={() => handleRate('AGAIN')} 
                disabled={isSubmitting}
                shortcut="1"
              />
              <RatingButton 
                label="Hard" 
                sub="1d" 
                color="bg-orange-500" 
                shadow="#c2410c" 
                onClick={() => handleRate('HARD')} 
                disabled={isSubmitting}
                shortcut="2"
              />
              <RatingButton 
                label="Good" 
                sub="3d" 
                color="bg-green-500" 
                shadow="#15803d" 
                onClick={() => handleRate('GOOD')} 
                disabled={isSubmitting}
                shortcut="3"
              />
              <RatingButton 
                label="Easy" 
                sub="5d" 
                color="bg-sky-500" 
                shadow="#0369a1" 
                onClick={() => handleRate('EASY')} 
                disabled={isSubmitting}
                shortcut="4"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <p className="text-center mt-6 text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest hidden md:block">
            {isFlipped ? 'Press 1-4 to rate' : 'Press Space to flip'}
        </p>
      </div>
    </div>
  );
}

function RatingButton({ label, sub, color, shadow, onClick, disabled, shortcut }: any) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      style={{ boxShadow: disabled ? 'none' : `0 6px 0 0 ${shadow}` }}
      className={`relative h-20 md:h-24 flex flex-col items-center justify-center rounded-3xl ${color} hover:brightness-110 text-white transition-all active:translate-y-1 active:shadow-none border-0 overflow-hidden group`}
    >
        <span className="absolute top-2 left-3 text-[10px] font-black opacity-30 group-hover:opacity-60 transition-opacity">
            {shortcut}
        </span>
      <span className="text-lg md:text-xl font-black tracking-tight">{label}</span>
      <span className="text-[10px] md:text-xs font-bold opacity-80">{sub}</span>
    </Button>
  );
}
