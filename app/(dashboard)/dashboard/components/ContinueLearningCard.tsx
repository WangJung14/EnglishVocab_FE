'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AnimatedList from './AnimatedList';
import { LessonData } from '../page';

// -------------------------------------------------------
// Item Row — rendered per lesson inside AnimatedList
// -------------------------------------------------------
function LessonListItem({
  lesson,
  isSelected,
}: {
  lesson: LessonData;
  isSelected: boolean;
}) {
  const percentage =
    Math.round((lesson.completedItems / (lesson.totalItems || 1)) * 100) ||
    lesson.progress;

  return (
    <div
      className={`flex items-center justify-between p-4 bg-white dark:bg-[#111] rounded-2xl shadow-sm border transition-all gap-4 ${
        isSelected
          ? 'border-sky-400 ring-1 ring-sky-400'
          : 'border-border hover:border-sky-300'
      }`}
    >
      {/* Left: info */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Status badge + clock */}
        <div className="flex items-center justify-between">
          <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-950/50 dark:text-sky-300 shadow-none border-0 font-bold uppercase tracking-widest text-[9px] px-2.5 py-0.5 pointer-events-none">
            ĐANG HỌC DỞ
          </Badge>
          <Clock size={14} className="text-muted-foreground opacity-50 shrink-0" />
        </div>

        {/* Title */}
        <h4 className="text-sm sm:text-base font-bold text-foreground line-clamp-2 leading-snug pr-2">
          {lesson.title}
        </h4>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Tiến trình
            </span>
            <span className="text-xs font-black text-sky-600 dark:text-sky-400">
              {percentage}%
            </span>
          </div>
          <Progress
            value={percentage}
            className="h-1.5 bg-sky-100 dark:bg-sky-950/50 [&>div]:bg-sky-500 shadow-inner"
          />
          <p className="text-[10px] text-muted-foreground font-medium text-right">
            {lesson.completedItems} / {lesson.totalItems} từ đã học
          </p>
        </div>
      </div>

      {/* Right: CTA button */}
      <div className="shrink-0">
        <Button
          className="w-12 h-12 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white shadow-[0_4px_0_0_#0284c7] hover:shadow-[0_2px_0_0_#0284c7] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all p-0 flex items-center justify-center cursor-pointer"
          asChild
        >
          <Link href={`/lessons/${lesson.id}`}>
            <PlayCircle size={24} className="fill-white/20" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

// -------------------------------------------------------
// Empty state
// -------------------------------------------------------
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center h-full z-10 isolate relative">
      <div className="p-4 rounded-full bg-muted/50 mb-4 shadow-inner">
        <BookOpen strokeWidth={1.5} size={32} className="text-muted-foreground opacity-70" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">Hãy bắt đầu bài học đầu tiên!</h3>
      <p className="text-sm font-medium text-muted-foreground mb-6 max-w-xs">
        Tiến trình sẽ được cập nhật ở đây. Khám phá hàng ngàn từ vựng và ngữ pháp ngay.
      </p>
      <Button
        asChild
        className="bg-sky-500 hover:bg-sky-400 font-bold rounded-2xl px-8 shadow-[0_4px_0_0_#0284c7] active:shadow-none active:translate-y-1 transition-all h-12"
      >
        <Link href="/courses">Khám phá khoá học</Link>
      </Button>
    </div>
  );
}

// -------------------------------------------------------
// Main Card — exported, used inside BentoDashboard
// -------------------------------------------------------
export default function ContinueLearningCard({ lessons }: { lessons: LessonData[] }) {
  if (!lessons || lessons.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col h-full relative group z-10 isolate p-2">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-400 to-sky-500 group-hover:from-sky-300 group-hover:to-sky-400 transition-colors z-20 rounded-t-[24px]" />

      {/* Section header */}
      <div className="pt-5 pb-2 px-2 flex items-center justify-between">
        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
          Tiếp tục học
        </span>
        <span className="text-[10px] font-bold text-sky-500">
          {lessons.length} bài đang dở
        </span>
      </div>

      <AnimatedList
        items={lessons}
        displayScrollbar={true}
        renderItem={(lesson, index, isSelected) => (
          <LessonListItem lesson={lesson} isSelected={isSelected} />
        )}
      />
    </div>
  );
}
