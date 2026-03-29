import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { BookOpen, Languages, AlertCircle, Home, ChevronRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { 
  ProgressTracker, 
  VocabularyGrid, 
  ReadingPassage,
  StickyActionBar 
} from './LessonClientUI';

import { getMockLessonDetail, getMockWords, getMockReading } from '@/lib/mockData';

const API_BASE = 'http://localhost:8080/api/v1';

// ==========================================
// 1. DATA INTERFACES QUY CHUẨN BACKEND
// ==========================================

export interface LessonDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  lessonType: 'VOCABULARY' | 'GRAMMAR' | 'PRONUNCIATION';
  isPublished: boolean;
}

export interface WordItem {
  id: string;
  word: string;
  meaning: string;
  displayOrder: number;
}

export interface ReadingItem {
  id: string;
  title: string;
  content: string;
  translation: string;
}

// ==========================================
// 2. SERVER FETCH HELPER
// ==========================================
async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value || '';
}

async function serverFetch(endpoint: string) {
  const token = await getToken();
  if (!token) throw new Error('Yêu cầu đăng nhập thông qua Cookie để xem bài học này.');

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // Bài học hiếm khi thay đổi, có thể revalidate cao hơn tuỳ ý
    next: { revalidate: 60 }
  });

  const data = await res.json();
  if (data.code !== 1000) throw new Error(data.message || `Lỗi API: ${endpoint}`);
  return data.result;
}

// ==========================================
// 3. MAIN SERVER COMPONENT
// ==========================================

export default async function LessonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Destructure slug từ Promise theo Document Recommend của Next.js 15
  const { slug } = await params;

  try {
    // 3.1 Fetch bước A: Lấy thông tin Lesson Metadata -> lấy lessonId
    let lesson: LessonDetail;
    try {
      lesson = await serverFetch(`/lesson/${slug}`);
    } catch {
       // [MOCK] Nếu Database thật không tồn tại URL này, đổ Mock Date vô để xem Demo View
      console.log("-> Bypass: Trả mock data cho /lesson/" + slug);
      lesson = getMockLessonDetail(slug);
    }

    // 3.2 Fetch bước B: Gọi Parallel hai APIs Words và Reading Passages sử dụng lessonId truy xuất được
    const [wordsRes, readingRes] = await Promise.allSettled([
      serverFetch(`/lessons/${lesson.id}/words`),
      serverFetch(`/lessons/${lesson.id}/reading`)
    ]);

    // Phân rã mảng an toàn (Fail API -> Đổ dữ liệu Mocking)
    const wordsList: WordItem[] = wordsRes.status === 'fulfilled' ? wordsRes.value : getMockWords(lesson.id);
    const readingData: ReadingItem | null = readingRes.status === 'fulfilled' ? readingRes.value : getMockReading(lesson.id);

    // Sắp xếp words theo displayOrder
    wordsList.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background pb-32">
        {/* Component kích hoạt gọi API /progress/start tàng hình */}
        <ProgressTracker lessonId={lesson.id} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* --- Breadcrumb Manual siêu gọn nhẹ --- */}
          <nav className="flex items-center text-sm font-medium text-muted-foreground mb-4">
            <Link href="/dashboard" className="hover:text-sky-500 flex items-center gap-1 transition-colors">
              <Home size={14} /> Dashboard
            </Link>
            <ChevronRight size={14} className="mx-2 opacity-50" />
            <Link href="/courses" className="hover:text-sky-500 transition-colors">Khoá học</Link>
            <ChevronRight size={14} className="mx-2 opacity-50" />
            <span className="text-foreground font-bold line-clamp-1">{lesson.title}</span>
          </nav>

          {/* --- Header Section --- */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300 font-bold uppercase tracking-widest text-[10px] px-3 py-1 border-0 shadow-none">
                {lesson.lessonType}
              </Badge>
              {lesson.isPublished && (
                <Badge variant="outline" className="text-green-600 border-green-200 dark:text-green-400 dark:border-green-900 font-bold text-[10px]">
                  PUBLISHED
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
              {lesson.title}
            </h1>
            <p className="text-lg text-muted-foreground font-medium max-w-3xl">
              {lesson.content}
            </p>
          </header>

          {/* --- Tabs Layout (Vocabulary & Reading) --- */}
          <main className="mt-8">
            <Tabs defaultValue="vocabulary" className="w-full">
              
              <TabsList className="bg-muted/50 p-1 w-full max-w-md grid grid-cols-2 rounded-xl mb-8">
                <TabsTrigger value="vocabulary" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-sky-500 font-bold">
                  <BookOpen size={16} className="mr-2" /> Từ vựng
                </TabsTrigger>
                <TabsTrigger value="reading" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-sky-500 font-bold">
                  <Languages size={16} className="mr-2" /> Bài đọc
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vocabulary" className="focus-visible:outline-none focus-visible:ring-0 mt-0">
                 <VocabularyGrid words={wordsList} />
              </TabsContent>

              <TabsContent value="reading" className="focus-visible:outline-none focus-visible:ring-0 mt-0">
                 <ReadingPassage reading={readingData} />
              </TabsContent>
              
            </Tabs>
          </main>
        </div>

        {/* --- Action Bar chốt hạ màn hình --- */}
        <StickyActionBar lessonId={lesson.id} />
        
      </div>
    );
  } catch (err: any) {
    // Catcher lỗi khi Fetch `lesson` failed -> 404 hoặc 500
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg border-2 border-border/50">
          <CardHeader className="text-center pt-8">
             <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={40} className="text-destructive" />
            </div>
            <CardTitle className="text-2xl font-black">Không tìm thấy Bài Học</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-8">
            <p className="text-muted-foreground font-medium mb-8">
              {err.message || `Đường dẫn /lesson/${slug} không tồn tại hoặc bạn không có quyền truy cập. Vui lòng kiểm tra lại.`}
            </p>
            <Button asChild className="font-bold h-12 rounded-xl shadow-[0_4px_0_0_#0f172a] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#0f172a] active:shadow-none active:translate-y-[4px] transition-all px-10">
              <Link href="/dashboard">Về màn hình chính</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}
