import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { 
  Flame, 
  BookOpen, 
  Trophy, 
  Zap, 
  ArrowRight,
  Brain,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle 
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const API_BASE = 'http://localhost:8080/api/v1';

// ==========================================
// THÀNH PHẦN HELPER & API FETCH
// ==========================================

// Lấy token từ cookies đính kèm vào req để Server Component có thể xác thực
async function getToken() {
  const cookieStore = await cookies();
  // Ở đây bắt buộc ứng dụng phải lưu token vào cookie thay vì localStorage để Next.js SSR đọc được
  return cookieStore.get('accessToken')?.value || '';
}

// Hàm fetch data chuẩn hóa xử lý lỗi đồng bộ với backend
async function serverFetch(endpoint: string) {
  const token = await getToken();
  
  if (!token) {
    throw new Error('Không tìm thấy token đăng nhập. Vui lòng đăng nhập lại (cần lưu accessToken vào Cookie thay vì localStorage).');
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // Server fetch của Next 15 mặc định có thể cache được. Nhưng đối với Dashboard data thường xuyên thay đổi ta dùng cache: 'no-store'
    cache: 'no-store'
  });

  const data = await res.json();
  
  if (data.code !== 1000) {
    throw new Error(data.message || `Lỗi khi lấy dữ liệu: ${endpoint}`);
  }
  
  return data.result;
}

// ==========================================
// CÁC COMPONENT XÂY DỰNG GIAO DIỆN CON
// ==========================================

function StreakDisplay({ streakCount = 0 }: { streakCount?: number }) {
  const isZero = streakCount === 0;
  return (
    <Card className="flex items-center justify-between p-6">
      <div className="flex items-center gap-4">
        {/* Box chứa Icon lửa */}
        <div className={`p-3 rounded-xl transition-colors ${isZero ? 'bg-muted' : 'bg-amber-100 dark:bg-amber-500/20'}`}>
          <Flame 
            size={32} 
            className={`${isZero ? 'text-muted-foreground opacity-50' : 'text-amber-500'} transition-all`} 
          />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-1">
            Current Streak
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-foreground">{streakCount}</span>
            <span className="text-sm font-medium text-muted-foreground">ngày</span>
          </div>
        </div>
      </div>
      <div className="text-right hidden sm:block max-w-[200px]">
        <p className="text-sm font-medium text-muted-foreground">
          {isZero ? 'Hành trình ngàn dặm bắt đầu từ 1 bước chân!' : 'Bạn đang làm rất xuất sắc. Tiếp tục phát huy!'}
        </p>
      </div>
    </Card>
  );
}

function StatsCard({ title, value, subValue, icon: Icon, colorClass }: {
  title: string;
  value: string | number;
  subValue?: React.ReactNode;
  icon: React.ElementType;
  colorClass: string;
}) {
  return (
    <Card className="flex flex-col p-5 border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
        <Icon size={20} className={colorClass} />
      </div>
      <div className="mt-auto">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {subValue && (
          <div className="mt-2 text-sm text-muted-foreground font-medium">
            {subValue}
          </div>
        )}
      </div>
    </Card>
  );
}

function ContinueLearningCard({ lesson }: { lesson: any }) {
  if (!lesson) {
    return (
      <Card className="flex flex-col justify-center items-center p-8 text-center h-full border-dashed">
        <BookOpen size={48} className="text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-foreground mb-2">Chưa có bài học nào</h3>
        <p className="text-sm text-muted-foreground mb-6">Bạn chưa bắt đầu tiến trình học tập nào trên hệ thống.</p>
        <Button asChild className="bg-sky-500 hover:bg-sky-600 font-bold rounded-full px-6">
          <Link href="/courses">Bắt đầu học ngay</Link>
        </Button>
      </Card>
    );
  }

  const { title, progress = 0, totalItems = 10, completedItems = 0, id } = lesson;
  const percentage = Math.round((completedItems / totalItems) * 100) || progress;

  return (
    <Card className="flex flex-col h-full border-sky-500/20 shadow-sm relative overflow-hidden">
      {/* Decoupled top gradient feeling */}
      <div className="absolute top-0 left-0 w-full h-1 bg-sky-500" />
      
      <CardHeader className="pb-4 mt-2">
        <div className="flex justify-between items-start">
          <Badge className="bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 shadow-none border-0 font-bold mb-3 uppercase tracking-wider text-[10px]">
            Tiếp tục học
          </Badge>
          <Clock size={16} className="text-muted-foreground opacity-70" />
        </div>
        <CardTitle className="text-xl font-bold line-clamp-2">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-4 flex-1">
        <div className="space-y-3 mt-4">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-muted-foreground">Tiến độ hiện tại</span>
            <span className="text-sky-600 dark:text-sky-400">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2.5 bg-sky-100 dark:bg-sky-950 [&>div]:bg-sky-500" />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl" asChild>
          <Link href={`/lessons/${id}`}>
            Tiếp tục lộ trình <ArrowRight size={18} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function SRSQuickCard({ dueCount = 0 }: { dueCount: number }) {
  const isZero = dueCount === 0;
  
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-100 dark:border-indigo-900 overflow-hidden relative shadow-sm h-full flex flex-col">
      {/* Background Graphic */}
      <div className="absolute -right-8 -top-8 text-indigo-500/10 dark:text-indigo-400/5">
        <Brain size={140} />
      </div>
      
      <CardContent className="p-6 relative z-10 flex flex-col h-full mt-2">
        <div className="mb-4">
          <Badge variant="outline" className="border-indigo-200 text-indigo-700 font-bold dark:border-indigo-700/50 dark:text-indigo-300 bg-white/60 dark:bg-black/20 uppercase tracking-widest text-[10px]">
            Spaced Repetition
          </Badge>
        </div>
        
        <h3 className="text-2xl font-black text-foreground mb-2">Thẻ ôn tập hôm nay</h3>
        <p className="text-sm font-medium text-muted-foreground mb-8 pr-12">
          Thuật toán lặp lại ngắt quãng sẽ tự động tính toán từ vựng nào cần nhắc lại.
        </p>
        
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className={`text-5xl font-black ${isZero ? 'text-indigo-300 dark:text-indigo-800' : 'text-indigo-600 dark:text-indigo-400'}`}>
              {dueCount}
            </span>
            <span className="text-[12px] font-bold uppercase tracking-wide text-muted-foreground mt-1">từ cần ôn</span>
          </div>
          
          <Button 
            variant={isZero ? "secondary" : "default"}
            className={`${isZero ? 'bg-white/50 dark:bg-white/10' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'} font-bold rounded-xl p-6`}
            disabled={isZero}
            asChild
          >
            <Link href="/srs/due">
              {isZero ? "Đã ôn xong" : "Review Now"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentLessonCard({ item }: { item: any }) {
  return (
    <Link href={`/lessons/${item.id}`} className="group block mb-2 last:mb-0">
      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-950 transition-colors border border-transparent group-hover:border-sky-100 dark:group-hover:border-sky-900">
        <div className="bg-sky-100 dark:bg-sky-900/50 p-2.5 rounded-lg text-sky-600 dark:text-sky-400">
          <CheckCircle2 size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-foreground truncate">{item.title}</h4>
          <p className="text-xs font-medium text-muted-foreground truncate mt-1">
            Đã hoàn thành {item.completedAt ? new Date(item.completedAt).toLocaleDateString('vi-VN') : 'gần đây'}
          </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border shadow-sm group-hover:bg-sky-500 group-hover:text-white transition-colors group-hover:border-sky-500">
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}

// ==========================================
// THÀNH PHẦN KHUNG XƯƠNG (LOADING STATE)
// ==========================================
function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-pulse w-full">
      <div className="flex items-center gap-5">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-40 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(k => <Skeleton key={k} className="h-32 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[280px] rounded-2xl" />
          <Skeleton className="h-[280px] rounded-2xl" />
        </div>
        <Skeleton className="h-[280px] rounded-2xl col-span-1" />
      </div>
    </div>
  );
}

// ==========================================
// CẤU TRÚC TRANG CHÍNH (ASYNC SERVER PAGE)
// ==========================================

export default async function DashboardPage() {
  // Thực thi lệnh parse dữ liệu tại Server để HTML render siêu tốc khi đẩy về client (Next 15 RSC)
  try {
    const [userReq, statsReq, progressReq, srsReq] = await Promise.allSettled([
      serverFetch('/users/me'),
      serverFetch('/users/me/stats'),
      serverFetch('/users/me/progress?limit=6'),
      serverFetch('/srs/stats')
    ]);

    // Nếu endpoint `user` quan trọng nhất nổ, lật xuống catch render luôn màn hình cảnh báo lỗi
    if (userReq.status === 'rejected') {
      throw new Error(userReq.reason.message || 'Phiên làm việc lỗi. Vui lòng xác thực lại!');
    }

    const unwrap = (res: PromiseSettledResult<any>, fallback: any) => 
      res.status === 'fulfilled' ? res.value : fallback;

    const user = userReq.value;
    const stats = unwrap(statsReq, {
      totalLessonsCompleted: 0,
      completionRate: 0,
      averageScore: 0,
      totalWordsLearned: 0
    });
    
    // progress list: mảng bài học gần nhất.
    const progressList = unwrap(progressReq, []);
    
    // số lượng thẻ nhớ due date
    const srsStats = unwrap(srsReq, { dueToday: 0 });

    const inProgressLesson = progressList.find((p: any) => p.status === 'IN_PROGRESS') || progressList[0];
    const recentLessons = progressList.filter((p: any) => p.id !== (inProgressLesson?.id)).slice(0, 4);

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        {/* === 1. Hero Section === */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          <Avatar className="w-20 h-20 border-[3px] border-background shadow-md">
            <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="text-2xl font-black bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
              {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <h1 className="text-3xl font-black text-foreground tracking-tight">
                Chào mừng, {user.firstName} {user.lastName}!
              </h1>
              {user.membershipType === 'PREMIUM' ? (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 dark:bg-amber-500/20 dark:border-amber-500/30 px-3 py-1 font-bold">
                  <Star size={13} className="mr-1.5 fill-amber-500 text-amber-500" /> Premium Plus
                </Badge>
              ) : (
                <Badge variant="secondary" className="font-bold text-xs uppercase tracking-wide">
                  Gói Free
                </Badge>
              )}
            </div>
            <p className="text-base font-medium text-muted-foreground">
              Sẵn sàng để chinh phục những đỉnh cao mới cùng từ vựng hôm nay chứ?
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* === 2. Khối hiển thị chuỗi kỷ lục (Mock 0) === */}
          <StreakDisplay streakCount={0} />

          {/* === 3. Các Card Nhỏ Hiển Thị Thống Kê Tổng Quan === */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title="Bài học hoàn thành" 
              value={stats.totalLessonsCompleted || 0}
              icon={BookOpen}
              colorClass="text-sky-500"
            />
            <StatsCard 
              title="Tỷ lệ thuần thục (%)" 
              value={`${(stats.completionRate || 0).toFixed(1)}`}
              icon={Trophy}
              colorClass="text-green-500"
            />
            <StatsCard 
              title="Điểm số trung bình" 
              value={(stats.averageScore || 0).toFixed(1)}
              icon={Star}
              colorClass="text-amber-500"
            />
            <StatsCard 
              title="Từ vựng đã nắm bắt" 
              value={stats.totalWordsLearned || 0}
              icon={Zap}
              colorClass="text-purple-500"
            />
          </div>

          {/* === 4. Widget Học Tập Chính (Chia layout lưới) === */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Vùng tương tác Left (2 Cột nhỏ) */}
            <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                <ContinueLearningCard lesson={inProgressLesson} />
                <SRSQuickCard dueCount={srsStats.dueToday || 0} />
              </div>
            </div>

            {/* Vùng tóm tắt tiến trình (Right) */}
            <div className="lg:col-span-1 h-full">
              <Card className="h-full flex flex-col shadow-sm border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold">Lịch sử tiến độ</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  {recentLessons.length > 0 ? (
                    <div className="space-y-1">
                      {recentLessons.map((lesson: any, i: number) => (
                        <RecentLessonCard key={lesson.id || i} item={lesson} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-[200px] text-muted-foreground">
                      <Clock size={48} className="opacity-20 mb-4" />
                      <p className="text-sm font-medium">Bạn chưa hoàn thành<br />bất kỳ bài học nào gần đây.</p>
                    </div>
                  )}
                </CardContent>
                {recentLessons.length > 0 && (
                  <CardFooter className="pt-0 justify-center">
                    <Button variant="ghost" size="sm" className="w-full text-muted-foreground text-xs font-bold tracking-wide" asChild>
                      <Link href="/history">XEM TẤT CẢ LỊCH SỬ</Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
            
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    // === XỬ LÝ LỖI === 
    // Giao diện sẽ rẽ nhánh về đây khi promise reject
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="bg-destructive/10 p-6 rounded-full mb-6">
          <AlertCircle size={56} className="text-destructive" />
        </div>
        <h2 className="text-3xl font-black text-foreground mb-3">Server Không Đáp Ứng</h2>
        <p className="text-base text-muted-foreground font-medium mb-10 max-w-lg">
          {error.message || 'Không thể thiết lập kết nối tới Backend Service. Hãy kiểm tra kết nối mạng hoặc thử xoá bộ nhớ đệm nếu bạn mới cấp quyền truy cập.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button variant="outline" className="font-bold h-12 px-8 rounded-xl" asChild>
            <Link href="/login">Xác thực lại</Link>
          </Button>
          <Button className="font-bold h-12 px-8 rounded-xl bg-sky-500 hover:bg-sky-600 text-white" asChild>
            <Link href="/dashboard">Thử tải lại Trang</Link>
          </Button>
        </div>
      </div>
    );
  }
}
