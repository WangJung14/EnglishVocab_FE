'use client';

import { Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DashboardData } from '@/app/(dashboard)/dashboard/types';

interface StreakCardProps {
  data: DashboardData;
}

export function StreakCard({ data }: StreakCardProps) {
  const { currentStreak, longestStreak, totalTopicsCompleted } = data;
  const isZero = currentStreak === 0;

  return (
    <Card className="flex items-center justify-between p-6 rounded-xl w-full">
      {/* ── Left: Current Streak ── */}
      <div className="flex items-center gap-4">
        <Flame 
          size={32} 
          className={`text-orange-500 ${isZero ? 'opacity-30' : ''}`} 
        />
        <div className="flex flex-col">
          <span className="text-5xl font-bold text-foreground">
            {currentStreak}
          </span>
          <span className="text-sm text-muted-foreground mt-1">
            {isZero ? 'Bắt đầu streak hôm nay!' : 'ngày liên tiếp'}
          </span>
        </div>
      </div>

      <Separator orientation="vertical" className="h-16 mx-4" />

      {/* ── Right: Records ── */}
      <div className="flex items-center gap-12 sm:gap-16">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Streak dài nhất
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-foreground">{longestStreak}</span>
            <span className="text-sm text-muted-foreground">ngày</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Chủ đề hoàn thành
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-foreground">{totalTopicsCompleted}</span>
            <span className="text-sm text-muted-foreground">chủ đề</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
