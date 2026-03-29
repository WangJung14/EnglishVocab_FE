'use client';

import { BookCheck, TrendingUp, Star, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DashboardData, StatsData } from '@/app/(dashboard)/dashboard/types';

interface StatsGridProps {
  dashboard: DashboardData;
  stats: StatsData;
}

export function StatsGrid({ dashboard, stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* ── Card 1: Bài học hoàn thành ── */}
      <Card className="p-5 rounded-xl space-y-2">
        <BookCheck size={20} className="text-blue-500" />
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Bài học hoàn thành
        </p>
        <p className="text-3xl font-bold text-foreground">
          {stats.totalLessonsCompleted}
        </p>
        <p className="text-xs text-muted-foreground">
          /{stats.totalLessonsStarted} đã bắt đầu
        </p>
      </Card>

      {/* ── Card 2: Tỷ lệ hoàn thành ── */}
      <Card className="p-5 rounded-xl space-y-2">
        <TrendingUp size={20} className="text-green-500" />
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Tỷ lệ hoàn thành
        </p>
        <p className="text-3xl font-bold text-foreground">
          {stats.completionRate.toFixed(1)}%
        </p>
        <Progress value={Math.round(stats.completionRate)} className="h-1.5 mt-1" />
      </Card>

      {/* ── Card 3: Điểm trung bình ── */}
      <Card className="p-5 rounded-xl space-y-2">
        <Star size={20} className="text-amber-500" />
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Điểm trung bình
        </p>
        <p className="text-3xl font-bold text-foreground">
          {stats.averageScore.toFixed(1)}
        </p>
        <p className="text-xs text-muted-foreground">
          trên thang 100
        </p>
      </Card>

      {/* ── Card 4: Từ vựng đã học ── */}
      <Card className="p-5 rounded-xl space-y-2">
        <Brain size={20} className="text-purple-500" />
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Từ vựng đã học
        </p>
        <p className="text-3xl font-bold text-foreground">
          {stats.totalWordsLearned}
        </p>
        <p className="text-xs text-muted-foreground">
          {stats.reviewCount} lần ôn tập
        </p>
      </Card>
    </div>
  );
}
