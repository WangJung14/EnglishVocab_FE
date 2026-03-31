import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import BentoDashboard from './components/BentoDashboard';
import ContinueLearningCard from './components/ContinueLearningCard';
import {
  Flame,
  BookOpen,
  Trophy,
  Zap,
  ArrowRight,
  Brain,
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Settings,
  LogOut,
  GraduationCap
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { mockUser, mockStats, mockProgress, mockSrs } from '@/lib/mockData';

const API_BASE = 'http://localhost:8080/api/v1';

// ==========================================
// 1. DATA INTERFACES
// ==========================================

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  membershipType: 'FREE' | 'PREMIUM';
}

export interface StatsData {
  totalLessonsStarted: number;
  totalLessonsCompleted: number;
  completionRate: number;
  averageScore: number;
  totalWordsLearned: number;
  reviewCount: number;
}

export interface LessonData {
  id: string;
  title: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED';
  progress: number;
  totalItems: number;
  completedItems: number;
  completedAt?: string;
  lastAccessedAt?: string;
}

export interface SRSData {
  dueToday: number;
  totalCardsActive: number;
  retentionRate: number;
}

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================
async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value || '';
}

async function serverFetch(endpoint: string) {
  const token = await getToken();

  if (!token) {
    throw new Error('Token không hợp lệ. Vui lòng đăng nhập lại hệ thống bằng Cookie.');
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // Dữ liệu cá nhân Dashboard tái lấy mới liên tục hoặc cache ngắn (Ví dụ: revalidate 60 giây như yêu cầu)
    next: { revalidate: 60 }
  });

  const data = await res.json();

  if (data.code !== 1000) {
    throw new Error(data.message || `Lỗi từ Server khi gọi ${endpoint}`);
  }

  return data.result;
}

// ==========================================
// 3. UI COMPONENTS NỘI BỘ
// ==========================================

function DashboardHeader({ user }: { user: UserData }) {
  return (
    <header className="sticky top-0 z-50 w-full mb-8 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-sky-500 rounded-lg p-1.5 flex items-center justify-center shadow-md shadow-sky-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-foreground hidden sm:inline-block">
            English<span className="text-sky-500">Hub</span>
          </span>
        </div>

        {/* Center: Demos Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/dashboard" className="text-foreground transition-colors hover:text-sky-500 font-bold">
            Dashboard
          </Link>
          <Link href="/courses" className="transition-colors hover:text-sky-500 pt-px">
            Khóa học (Courses)
          </Link>
          <Link href="/srs" className="transition-colors hover:text-sky-500 pt-px">
            Thẻ ôn (Flashcards)
          </Link>
          <Link href="/exercises/mock-lesson-4" className="transition-colors hover:text-sky-500 pt-px flex items-center gap-1">
            <Zap size={14} className="fill-amber-400 text-amber-500" />
            Đề thi (Quiz Test)
          </Link>
        </nav>

        {/* Right: Avatar Dropdown */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-sky-100 hover:bg-sky-50 p-0 focus-visible:ring-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl || ''} alt="User Avatar" />
                  <AvatarFallback className="bg-sky-100 text-sky-700 font-bold">
                    {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ cá nhân</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt hệ thống</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
                <Link href="/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất (Logout)</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function StreakDisplay({ streakCount = 0 }: { streakCount?: number }) {
  const isZero = streakCount === 0;
  return (
    <Badge
      variant="outline"
      className={`px-3 py-1.5 text-sm font-bold border-2 transition-colors flex items-center gap-1.5 ${isZero
        ? 'text-muted-foreground border-muted-foreground/30 bg-muted/40'
        : 'text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-500 dark:border-amber-500/30 dark:bg-amber-500/10'
        }`}
    >
      <Flame size={16} className={isZero ? 'opacity-50' : 'fill-amber-500'} />
      Current Streak: {streakCount} {isZero && '🔥'}
    </Badge>
  );
}

function StatsCard({ title, value, icon: Icon, subElement, colorClass = "text-sky-500" }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subElement?: React.ReactNode;
  colorClass?: string;
}) {
  // Bỏ thẻ <Card> của shadcn vì BentoGrid (GSAP) đã phủ bọc border ngoài
  return (
    <div className="flex flex-col p-6 isolate z-10 w-full h-full relative group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-foreground transition-colors">
          {title}
        </h3>
        <div className={`p-2 rounded-xl shrink-0 ml-2 bg-muted/80 dark:bg-muted/40 backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform ${colorClass}`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
      </div>
      <div className="mt-auto">
        <span className="text-3xl sm:text-4xl font-black text-foreground block tracking-tight">
          {value}
        </span>
        {subElement && (
          <div className="mt-3">
            {subElement}
          </div>
        )}
      </div>
    </div>
  );
}



function SRSQuickCard({ dueCount = 0 }: { dueCount: number }) {
  const isZero = dueCount === 0;

  return (
    <div className="relative isolate z-10 w-full h-full flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-amber-500 pointer-events-none" />

      <div className="absolute -right-6 -bottom-6 text-amber-500/10 dark:text-amber-500/5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 pointer-events-none">
        <Brain size={180} strokeWidth={1} />
      </div>

      <CardContent className="p-6 relative z-10 flex flex-col h-full mt-2 justify-between pointer-events-none">
        <div>
          <div className="mb-4">
            <Badge className="bg-amber-200/50 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 shadow-none border-0 font-bold uppercase tracking-widest text-[9px] px-2.5 py-0.5">
              Spaced Repetition System
            </Badge>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 leading-tight">Đến hạn ôn tập</h3>
          <p className="text-sm font-medium text-muted-foreground pr-4">
            Chỉ 5 phút ôn thẻ mỗi ngày giúp bạn ghi nhớ lâu.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-6 pt-4 border-t border-amber-500/20">
          <div className="flex flex-col items-center text-center">
            <span className={`text-[80px] leading-none font-black ${isZero ? 'text-amber-300 dark:text-amber-800/40' : 'text-amber-500 dark:text-amber-400'} drop-shadow-sm`}>
              {dueCount}
            </span>
            <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground mt-2">thẻ cần review</span>
          </div>

          <Button
            className={`w-full font-black rounded-2xl h-14 transition-all gap-2 pointer-events-auto cursor-pointer relative z-20 text-md ${isZero
              ? 'bg-muted text-muted-foreground'
              : 'bg-amber-500 hover:bg-amber-400 text-white shadow-[0_4px_0_0_#d97706] hover:shadow-[0_2px_0_0_#d97706] hover:translate-y-[2px] active:shadow-[0_0px_0_0_#d97706] active:translate-y-[4px]'
              }`}
            disabled={isZero}
            asChild={!isZero}
          >
            {isZero ? (
              <span>Tuyệt vời! Đã hoàn thành</span>
            ) : (
              <Link href="/srs">
                REVIEW NGAY <ArrowRight strokeWidth={3} size={20} />
              </Link>
            )}
          </Button>
        </div>
      </CardContent>
    </div>
  );
}

function RecentLessonCard({ item }: { item: LessonData }) {
  return (
    <Link href={`/lessons/${item.id}`} className="group block mb-3 last:mb-0">
      <div className="flex items-center gap-4 bg-background p-4 rounded-2xl shadow-sm border border-border group-hover:border-sky-200 dark:group-hover:border-sky-800 transition-all">
        <div className={`p-2.5 rounded-xl flex items-center justify-center ${item.status === 'COMPLETED' ? 'bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400' : 'bg-sky-50 text-sky-500 dark:bg-sky-950/40 dark:text-sky-400'
          }`}>
          {item.status === 'COMPLETED' ? <CheckCircle2 size={22} strokeWidth={2.5} /> : <BookOpen size={22} strokeWidth={2.5} />}
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <h4 className="text-sm font-bold text-foreground truncate">{item.title}</h4>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">
            {item.status === 'COMPLETED' ? 'Đã học xong' : `Tiến độ: ${item.progress}%`}
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border-border border text-muted-foreground group-hover:bg-sky-500 group-hover:text-white transition-colors group-hover:border-sky-500">
          <ArrowRight size={14} strokeWidth={2.5} />
        </div>
      </div>
    </Link>
  );
}

// ==========================================
// 4. SKELETON LOADER
// ==========================================
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/50">
      <header className="h-16 w-full border-b bg-background flex items-center px-4 md:px-8 mb-8">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-full ml-auto" />
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8 animate-pulse pb-16">
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-6 w-32 rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(k => <Skeleton key={k} className="h-32 rounded-2xl" />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <Skeleton className="h-[280px] rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
          </div>
          <div className="col-span-1 lg:col-span-1">
            <Skeleton className="h-[400px] rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. SERVER PAGE CHÍNH 
// ==========================================

export default async function DashboardPage() {
  try {
    // Gọi song song (Parallel Data Fetching) API endpoints
    const [userReq, statsReq, progressReq, srsReq] = await Promise.allSettled([
      serverFetch('/users/me'),
      serverFetch('/users/me/stats'),
      serverFetch('/users/me/progress?limit=5'), // Limit 5 như schema Notion yêu cầu
      serverFetch('/srs/stats')
    ]);

    // Handle Auth Error -> Kích hoạt màn hình fallback bắt lỗi bên dưới Catch block
    if (userReq.status === 'rejected') {
      throw new Error(userReq.reason?.message || 'Phiên đăng nhập hết hạn hoặc Server không phản hồi!');
    }
    const unwrap = (res: PromiseSettledResult<any>, fallback: any) =>
      res.status === 'fulfilled' ? res.value : fallback;

    // Phân rã dữ liệu an toàn, nếu Backend trả mảng lỗi/rỗng -> fallback thẳng vào MockData
    const user: UserData = unwrap(userReq, mockUser);

    const stats: StatsData = unwrap(statsReq, mockStats);

    // progress list: mảng bài học
    let progressList: LessonData[] = unwrap(progressReq, []);

    // Tự động fake dữ liệu nếu backend trả về rỗng
    if (progressList.length === 0) {
      progressList = mockProgress;
    }

    const srsStats: SRSData = unwrap(srsReq, mockSrs);

    // Lấy danh sách các bài học (ưu tiên đang học) để đưa lên danh sách "Tiếp tục học"
    const inProgressLessons = progressList.filter(p => p.status === 'IN_PROGRESS');
    const displayLessons = inProgressLessons.length > 0 ? inProgressLessons : progressList.slice(0, 3);

    // Các bài còn lại (có thể cho vào thẻ Recent)
    const recentLessons = progressList.filter(p => !displayLessons.some(d => d.id === p.id)).slice(0, 4);

    return (
      <div className="min-h-screen bg-[#F7F9F9] dark:bg-background">
        {/* Navigation Bar */}
        <DashboardHeader user={user} />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full space-y-10">

          {/* === HERO SECTION === */}
          <section className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between border-b pb-8 dark:border-border/60">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-background shadow-lg shadow-sky-500/10">
                <AvatarImage src={user.avatarUrl || ''} alt="User avatar" />
                <AvatarFallback className="text-3xl font-black bg-gradient-to-br from-sky-400 to-sky-600 text-white">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                    Chào mừng trở lại, {user.firstName}!
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {user.membershipType === 'PREMIUM' ? (
                    <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-md shadow-amber-500/20 px-3 py-1 font-bold">
                      <Star size={14} className="mr-1.5 fill-white" /> PREMIUM
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="font-bold text-xs uppercase tracking-widest px-3 py-1 text-muted-foreground border-border/60">
                      FREE PLAN
                    </Badge>
                  )}
                  {/* Streak Mocking Data */}
                  <StreakDisplay streakCount={0} />
                </div>
              </div>
            </div>
          </section>

          {/* === BENTO GSAP ANIMATION GRID LÕI === */}
          <section className="pt-2">
            <BentoDashboard items={[
              {
                id: 'stats-completed',
                className: 'col-span-1 border-0 bg-white/60 dark:bg-card/60 backdrop-blur-md',
                content: <StatsCard title="BÀI HỌC ĐÃ XONG" value={stats.totalLessonsCompleted || 0} icon={BookOpen} colorClass="text-sky-500" />
              },
              {
                id: 'stats-rate',
                className: 'col-span-1 border-0 bg-white/60 dark:bg-card/60 backdrop-blur-md',
                content: <StatsCard title="TỶ LỆ HOÀN THÀNH" value={`${(stats.completionRate || 0).toFixed(1)}%`} icon={Trophy} colorClass="text-green-500" subElement={<Progress value={stats.completionRate || 0} className="h-2 bg-green-100 dark:bg-green-950/40 [&>div]:bg-green-500 shadow-inner" />} />
              },
              {
                id: 'stats-score',
                className: 'col-span-1 border-0 bg-white/60 dark:bg-card/60 backdrop-blur-md',
                content: <StatsCard title="ĐIỂM TRUNG BÌNH" value={(stats.averageScore || 0).toFixed(1)} icon={Star} colorClass="text-amber-500" />
              },
              {
                id: 'stats-words',
                className: 'col-span-1 border-0 bg-white/60 dark:bg-card/60 backdrop-blur-md',
                content: <StatsCard title="TỪ VỰNG GHI NHỚ" value={stats.totalWordsLearned || 0} icon={Zap} colorClass="text-purple-500" />
              },
              {
                id: 'continue-card',
                // Kéo dài ra chiếm 2 cột ngang, 2 cột dọc trên desktop
                className: 'col-span-1 md:col-span-2 lg:col-span-3 lg:row-span-2 border-0 bg-white/60 dark:bg-card/60 backdrop-blur-md xl:h-[400px]',
                content: <ContinueLearningCard lessons={displayLessons} />
              },
              {
                id: 'srs-card',
                // Tương tự, nằm dọc bên phải
                color: 'rgba(251, 191, 36, 0.05)', // Một xíu màu vàng nền cho thẻ riêng này
                className: 'col-span-1 md:col-span-2 lg:col-span-1 lg:row-span-2 border-0 bg-amber-50/60 dark:bg-amber-950/20 backdrop-blur-md xl:h-[400px]',
                content: <SRSQuickCard dueCount={srsStats.dueToday || 0} />
              }
            ]} />
          </section>

          {/* === RECENT LESSONS LƯU LƯỢNG LIST OUTSIDE === */}
          <section className="pt-2">
            <div className="flex items-center justify-between mb-6 px-1">
              <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                Hoạt động gần đây
              </h3>
              <Button variant="link" className="text-sky-500 font-bold p-0 hidden sm:flex" asChild>
                <Link href="/history">Xem toàn bộ lịch sử →</Link>
              </Button>
            </div>

            {recentLessons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recentLessons.map((item, idx) => (
                  <RecentLessonCard key={item.id || idx} item={item} />
                ))}
              </div>
            ) : (
              <div className="py-12 bg-white/50 dark:bg-card/30 border border-dashed rounded-[20px] text-center flex flex-col items-center">
                <Clock size={40} className="text-muted-foreground opacity-30 mb-4" />
                <span className="text-sm font-medium text-muted-foreground">Bạn chưa tham gia thêm lộ trình nào trong thời gian qua.</span>
              </div>
            )}
          </section>
        </main>
      </div>
    );
  } catch (err: any) {
    // === XỬ LÝ LỖI === 
    // Khi gọi Token fail hoặc Server API 500, Next Component đổ dồn về Error State
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full border-2 shadow-xl">
          <CardHeader className="text-center pt-8 pb-4">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={40} className="text-destructive" />
            </div>
            <CardTitle className="text-2xl font-black">Xác thực thất bại</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <p className="text-muted-foreground font-medium mb-8">
              {err.message || 'Hệ thống mất kết nối lên máy chủ hoặc Token không tồn tại. Hãy chắc chắn rằng bạn đã chấp nhận Cookie bằng luồng đăng nhập mới.'}
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full font-bold h-12 rounded-xl text-md">
                <Link href="/login">Đăng nhập tài khoản</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
