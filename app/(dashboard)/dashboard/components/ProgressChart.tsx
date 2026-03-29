'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { StatsData } from '@/app/(dashboard)/dashboard/types';

interface ProgressChartProps {
  stats: StatsData;
}

export default function ProgressChart({ stats }: ProgressChartProps) {
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week');

  const weekData = useMemo(() => {
    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    return days.map((day) => {
      const lessons = Math.floor(Math.random() * (Math.ceil(stats.totalLessonsCompleted / 7) * 2 + 1));
      const score = lessons > 0 ? Math.floor(Math.random() * 41) + 60 : 0;
      return { day, lessons, score };
    });
  }, [stats.totalLessonsCompleted]);

  const monthData = useMemo(() => {
    const weeks = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
    return weeks.map((week) => {
      const lessons = Math.floor(Math.random() * (Math.ceil(stats.totalLessonsCompleted / 4) * 2 + 1));
      const score = lessons > 0 ? Math.floor(Math.random() * 41) + 60 : 0;
      return { week, lessons, score };
    });
  }, [stats.totalLessonsCompleted]);

  const data = activeTab === 'week' ? weekData : monthData;

  return (
    <Card className="w-full p-6 rounded-xl border">
      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Tiến độ học tập</h3>
          <p className="text-xs text-muted-foreground">Số bài học và điểm số theo thời gian</p>
        </div>

        <div className="flex rounded-lg border p-0.5 gap-0.5 bg-muted">
          <button
            onClick={() => setActiveTab('week')}
            className={`transition-all ${
              activeTab === 'week'
                ? 'bg-background text-foreground shadow-sm rounded-md px-3 py-1 text-xs font-medium'
                : 'text-muted-foreground px-3 py-1 text-xs hover:text-foreground'
            }`}
          >
            Tuần này
          </button>
          <button
            onClick={() => setActiveTab('month')}
            className={`transition-all ${
              activeTab === 'month'
                ? 'bg-background text-foreground shadow-sm rounded-md px-3 py-1 text-xs font-medium'
                : 'text-muted-foreground px-3 py-1 text-xs hover:text-foreground'
            }`}
          >
            Tháng này
          </button>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey={activeTab === 'week' ? 'day' : 'week'}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={24}
              dx={-10}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={32}
              domain={[0, 100]}
              dx={10}
            />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              formatter={(value: any, name: string) =>
                name === 'score' ? [`${value} điểm`, 'Điểm TB'] : [`${value} bài`, 'Bài học']
              }
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            />
            <Bar
              yAxisId="left"
              dataKey="lessons"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
              name="lessons"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="score"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f59e0b' }}
              name="score"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* ── Custom Legend ── */}
      <div className="flex gap-4 justify-end mt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>Số bài học</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Điểm trung bình</span>
        </div>
      </div>
    </Card>
  );
}
