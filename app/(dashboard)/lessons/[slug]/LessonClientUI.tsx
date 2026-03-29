'use client';

import { useEffect, useState } from 'react';
import { Volume2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// --- Tiến trình Tracking Component (Non-visual) ---
export function ProgressTracker({ lessonId }: { lessonId: string }) {
  useEffect(() => {
    async function startProgress() {
      // Vì là Client Component, lấy từ Cookie thủ công hoặc có thể gọi API route (ở đây parse thủ công nhanh)
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
      if (!token) return;

      try {
        await fetch(`http://localhost:8080/api/v1/lessons/${lessonId}/progress/start`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
          }
        });
      } catch (error) {
        console.error("Không thể trigger Progress:", error);
      }
    }
    startProgress();
  }, [lessonId]);

  return null; // Component tàng hình chuyên tracking background
}

// --- Vocabulary Tab Grid ---
export function VocabularyGrid({ words }: { words: any[] }) {
  const playAudio = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Đọc chậm một chút
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!words || words.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/30 border-2 border-dashed rounded-2xl">
        <p className="text-muted-foreground font-medium">Không có từ vựng nào trong bài học này.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
      {words.map((w, index) => (
        <Card key={w.id || index} className="group cursor-pointer border-2 hover:border-sky-500 transition-all hover:shadow-md">
          <CardContent className="p-5 flex justify-between items-center gap-4">
             <div className="min-w-0 flex-1">
               <h4 className="font-extrabold text-xl text-sky-600 dark:text-sky-400 truncate tracking-tight">{w.word}</h4>
               <p className="text-sm font-medium text-muted-foreground mt-1 truncate">{w.meaning}</p>
             </div>
             <button 
                onClick={() => playAudio(w.word)} 
                className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-sky-50 text-sky-500 rounded-full hover:bg-sky-500 hover:text-white dark:bg-sky-950/50 dark:hover:bg-sky-500 transition-colors active:scale-95"
                title="Nghe phát âm"
             >
               <Volume2 size={22} strokeWidth={2.5} />
             </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- Reading Passage Tab ---
export function ReadingPassage({ reading }: { reading: any }) {
  const [showTrans, setShowTrans] = useState(false);

  if (!reading) {
    return (
      <div className="text-center py-16 bg-muted/30 border-2 border-dashed rounded-2xl">
        <p className="text-muted-foreground font-medium">Không có bài đọc trong bài học này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
       {/* Toolbar điều khiển */}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-card p-5 rounded-2xl border shadow-sm gap-4">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            Bài đọc: <span className="text-sky-600 dark:text-sky-400">{reading.title}</span>
          </h3>
          <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-xl px-4">
            <Label htmlFor="show-trans" className="font-semibold text-sm cursor-pointer select-none">Hiển thị Dịch nghĩa</Label>
            <Switch id="show-trans" checked={showTrans} onCheckedChange={setShowTrans} />
          </div>
       </div>
       
       {/* Văn bản */}
       <div className={`grid grid-cols-1 ${showTrans ? 'lg:grid-cols-2 gap-8' : 'max-w-4xl mx-auto'}`}>
         
         {/* Original Text */}
         <div className="prose dark:prose-invert prose-sky md:prose-lg max-w-none prose-p:leading-relaxed prose-p:font-medium prose-p:text-slate-700 dark:prose-p:text-slate-300 p-6 sm:p-8 bg-white dark:bg-card border rounded-3xl shadow-sm">
           {(reading.content || '').split('\n').map((paragraph: string, i: number) => {
              if (!paragraph.trim()) return <br key={i} />;
              return <p key={i}>{paragraph}</p>;
           })}
         </div>

         {/* Translation Text (Render Mở rộng khi Bật Switch) */}
         {showTrans && (
           <div className="prose dark:prose-invert md:prose-lg max-w-none prose-p:leading-relaxed p-6 sm:p-8 bg-sky-50 dark:bg-sky-950/20 rounded-3xl border border-sky-100 dark:border-sky-900/50">
             <div className="mb-4 inline-block px-3 py-1 bg-sky-200 text-sky-800 dark:bg-sky-900 dark:text-sky-200 text-xs font-bold rounded-lg uppercase tracking-wider">
               Bản dịch tiếng Việt
             </div>
             {(reading.translation || '').split('\n').map((paragraph: string, i: number) => {
                if (!paragraph.trim()) return <br key={i} />;
                return <p key={i} className="text-slate-600 dark:text-slate-400">{paragraph}</p>;
             })}
           </div>
         )}
       </div>
    </div>
  );
}

// --- Sticky Bottom Bar ---
export function StickyActionBar({ lessonId }: { lessonId: string }) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-background/80 backdrop-blur-lg border-t z-40 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
         <div className="hidden sm:block">
           <h4 className="font-bold text-foreground">Bạn đã sẵn sàng vượt ải?</h4>
           <p className="text-xs text-muted-foreground">Tham gia Quiz để hệ thống ghi nhận tiến độ thẻ nhớ SRS.</p>
         </div>
         <Button asChild size="lg" className="w-full sm:w-auto font-black rounded-2xl h-14 px-10 bg-sky-500 hover:bg-sky-400 text-white shadow-[0_4px_0_0_#0284c7] hover:shadow-[0_2px_0_0_#0284c7] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all text-lg">
           <Link href={`/exercises/${lessonId}`}>
             BẮT ĐẦU QUIZ <ArrowRight strokeWidth={3} className="ml-2" />
           </Link>
         </Button>
      </div>
    </div>
  );
}
