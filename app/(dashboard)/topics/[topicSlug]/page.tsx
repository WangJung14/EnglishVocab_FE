import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Home, ChevronRight, BookOpen, Quote, Headphones, PenTool, Flame, ArrowRight, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getMockTopicLessons, LessonListData } from '@/lib/mockData';

const API_BASE = 'http://localhost:8080/api/v1';

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value || '';
}

async function fetchLessons(topicSlug: string): Promise<LessonListData[]> {
  const token = await getToken();
  if (!token) throw new Error('Yêu cầu đăng nhập xác thực.');

  const res = await fetch(`${API_BASE}/topics/${topicSlug}/lessons`, {
    headers: { 'Authorization': `Bearer ${token}` },
    next: { revalidate: 30 } 
  });
  const data = await res.json();
  if (data.code !== 1073741824 && data.code !== 1000) throw new Error(data.message);
  return data.result;
}

export async function generateMetadata({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  return {
    title: `Lộ trình chinh phục ${topicSlug} - EnglishHub`,
    description: 'Chinh phục từng Bài học (Lesson) nhỏ trong bộ Lộ trình Syllabus chuẩn hoá quốc tế.',
  };
}

const getLessonIcon = (type: string) => {
  switch (type.toUpperCase()) {
    case 'VOCABULARY': return <BookOpen size={22} />;
    case 'GRAMMAR': return <PenTool size={22} />;
    case 'PRONUNCIATION': return <Headphones size={22} />;
    case 'PRACTICE': return <Flame size={22} />;
    default: return <Quote size={22} />;
  }
};

export default async function TopictSyllabusPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;

  let lessons: LessonListData[] = [];
  try {
    lessons = await fetchLessons(topicSlug);
  } catch (error) {
    console.log(`-> Bypass Fallback Data cho /topics/${topicSlug}/lessons`);
    lessons = getMockTopicLessons(topicSlug);
  }

  const activeLessons = lessons.filter(l => l.isPublished);

  if (!activeLessons || activeLessons.length === 0) {
     return notFound(); // Trả về trang 404 chuẩn của Next.js
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Breadcrumb Tối Giản */}
        <nav className="flex justify-center flex-wrap items-center text-sm font-medium text-muted-foreground">
          <Link href="/dashboard" className="hover:text-sky-500 transition-colors">Dashboard</Link>
          <ChevronRight size={14} className="mx-2 opacity-50" />
          <Link href="/courses" className="hover:text-sky-500 transition-colors">Khóa học</Link>
          <ChevronRight size={14} className="mx-2 opacity-50" />
          <span className="text-foreground font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">{topicSlug}</span>
        </nav>

        {/* Cấu trúc Header Giữa Tâm */}
        <header className="text-center space-y-4 pb-4">
          <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400 font-bold uppercase tracking-widest text-[10px] px-3 py-1 shadow-none border-0">
             LEARNING PATH
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
             Lộ trình <span className="text-sky-500">Mở Khoá Bài Học</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
             Bắt đầu chinh phục từ vựng và ngữ pháp. Cố gắng giữ vững chuỗi Streak bạn nhé!
          </p>
        </header>

        {/* Thiết kế Tree/Path Syllabus siêu đẹp */}
        <main className="relative mx-auto mt-8 px-4 sm:px-0 lg:max-w-2xl">
           
           {/* Đường thẳng cắm trục giữa Trái */}
           <div className="absolute left-[39px] sm:left-[47px] top-6 bottom-12 w-1.5 bg-sky-100 dark:bg-slate-800 rounded-full" />

           <div className="space-y-10 relative z-10">
             {activeLessons.map((lesson, idx) => {
               // Tạo màu luân phiên cho icon
               const colorClass = idx % 2 === 0 ? 'bg-sky-500 text-white shadow-sky-500/30' : 'bg-amber-500 text-white shadow-amber-500/30';
               const isPractice = lesson.lessonType === 'PRACTICE';
               
               return (
                 <div key={lesson.id} className="flex gap-4 sm:gap-6 relative group">
                    
                    {/* Nút Timeline Tròn Cứng */}
                    <div className="shrink-0 relative">
                       <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-black text-xl z-20 shadow-md transition-transform duration-300 group-hover:scale-110 border-4 border-slate-50 dark:border-background ${isPractice ? 'bg-orange-600 text-white shadow-orange-600/40' : colorClass}`}>
                          {getLessonIcon(lesson.lessonType)}
                       </div>
                    </div>
                    
                    {/* Thẻ Bài Học Content */}
                    <Card className={`flex-1 overflow-hidden transition-all duration-300 border-2 border-transparent bg-white dark:bg-card shadow-sm hover:shadow-xl group-hover:-translate-y-1 rounded-3xl ${isPractice ? 'hover:border-orange-500 outline outline-2 outline-orange-100 dark:outline-orange-950/50 outline-offset-4' : 'hover:border-sky-400'}`}>
                       <Link href={`/lessons/${lesson.slug}`} className="block h-full w-full outline-none focus:ring-4 focus:ring-sky-500/20 rounded-3xl">
                         <CardContent className="p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-4">
                           <div className="flex-1 min-w-0">
                              <Badge className={`font-bold mb-3 shadow-none border-0 mr-auto text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 ${isPractice ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50' : 'bg-slate-100 text-slate-500 dark:bg-slate-900'}`}>
                                {lesson.lessonType}
                              </Badge>
                              <h3 className="text-xl font-bold text-foreground leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                {lesson.title}
                              </h3>
                              <p className="text-sm font-medium text-muted-foreground mt-2 line-clamp-2">
                                {lesson.content || 'Hoàn thành bài học để mở khoá thẻ SRS'}
                              </p>
                           </div>
                           
                           {/* Mũi tên gọi hành động */}
                           <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0 ml-auto group-hover:bg-sky-500 group-hover:text-white transition-all shadow-inner">
                             <ArrowRight size={18} strokeWidth={2.5} />
                           </div>
                         </CardContent>
                       </Link>
                    </Card>
                 </div>
               );
             })}
           </div>
           
           {/* Nút Kết Thúc Lộ Trình - Biểu tượng Cúp Vô Địch */}
           <div className="flex gap-6 relative mt-12 items-center text-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
              <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-full border-4 border-dashed border-muted-foreground flex items-center justify-center -ml-[3px] sm:ml-0 bg-background z-20">
                <Trophy size={24} className="text-muted-foreground" />
              </div>
              <p className="font-bold text-muted-foreground tracking-widest uppercase">Hoàn thành chặng đường</p>
           </div>
        </main>
      </div>
    </div>
  );
}
