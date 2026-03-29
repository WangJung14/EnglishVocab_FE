import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Home, ChevronRight, BookText, Layers, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getMockTopics, TopicData } from '@/lib/mockData';

const API_BASE = 'http://localhost:8080/api/v1';

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value || '';
}

async function fetchTopics(categorySlug: string): Promise<TopicData[]> {
  const token = await getToken();
  if (!token) throw new Error('Yêu cầu đăng nhập xác thực.');

  const res = await fetch(`${API_BASE}/categories/${categorySlug}/topics`, {
    headers: { 'Authorization': `Bearer ${token}` },
    next: { revalidate: 60 } 
  });
  const data = await res.json();
  if (data.code !== 1073741824 && data.code !== 1000) throw new Error(data.message);
  return data.result;
}

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  return {
    title: `Danh sách chủ đề (${categorySlug}) - EnglishHub`,
    description: 'Chi tiết các chủ đề nằm trong phân mục ngoại ngữ',
  };
}

export default async function CategoryTopicsPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  
  let topics: TopicData[] = [];
  try {
    topics = await fetchTopics(categorySlug);
  } catch (error) {
    console.log(`-> Bypass Fallback Data cho /categories/${categorySlug}/topics`);
    topics = getMockTopics(categorySlug);
  }

  // Danh mục trống/Sai URL -> 404 UI
  if (!topics || topics.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
         <AlertCircle className="w-20 h-20 text-muted-foreground/30 mb-6" />
         <h1 className="text-2xl font-black text-foreground mb-2">Chưa có chủ đề nào</h1>
         <p className="text-muted-foreground font-medium mb-6">Chuyên mục "{categorySlug}" chưa có nội dung hoặc URL không tồn tại.</p>
         <Link href="/courses" className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl shadow-md transition-colors">
            Quay lại Khoá Học
         </Link>
      </div>
    );
  }

  // Sắp xếp tạm thời nếu API không hỗ trợ, ở đây dựa vào mock level
  const activeTopics = topics.filter(t => t.isPublished);

  return (
    <div className="min-h-[85vh] bg-slate-50 dark:bg-background pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Breadcrumb Navigate */}
        <nav className="flex flex-wrap items-center text-sm font-medium text-muted-foreground">
          <Link href="/dashboard" className="hover:text-sky-500 flex items-center gap-1 transition-colors">
            <Home size={14} /> Dashboard
          </Link>
          <ChevronRight size={14} className="mx-2 opacity-50" />
          <Link href="/courses" className="hover:text-sky-500 transition-colors">Khóa học</Link>
          <ChevronRight size={14} className="mx-2 opacity-50" />
          <span className="text-foreground font-bold capitalize px-3 py-1 bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 rounded-md">
            {activeTopics[0]?.categoryName || categorySlug}
          </span>
        </nav>

        {/* Page Header */}
        <header className="space-y-4 border-b border-border/50 pb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500 mb-2">
             <Layers size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">
             Lộ trình Chủ đề 
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl">
             Vượt ải tiến trình bằng cách hoàn thiện từng Topic. Chinh phục ngay bộ {activeTopics.length} chủ đề thử thách!
          </p>
        </header>

        {/* List UI Topics */}
        <main className="space-y-4">
          {activeTopics.map((topic, index) => (
            <Link key={topic.id} href={`/topics/${topic.slug}`} className="group block focus:outline-none focus:ring-4 focus:ring-sky-500/20 rounded-[1.5rem]">
              <Card className="border-2 border-transparent bg-white dark:bg-card hover:border-sky-400 shadow-sm hover:shadow-lg transition-all rounded-[1.5rem] overflow-hidden">
                <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 sm:items-center relative">
                   
                   {/* Level Badge Gradient Box */}
                   <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-sky-100 dark:from-slate-900 dark:to-sky-950 text-sky-600 dark:text-sky-400 items-center justify-center shadow-inner font-black text-2xl group-hover:scale-105 transition-transform duration-300">
                     {index + 1}
                   </div>

                   {/* Info */}
                   <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-3 mb-2">
                       <span className="sm:hidden font-black text-sky-500">#{index + 1}</span>
                       <Badge variant="secondary" className="font-bold text-[10px] bg-slate-100 text-slate-500 shadow-none border-0 uppercase tracking-widest">{topic.level}</Badge>
                     </div>
                     <h3 className="text-xl sm:text-2xl font-bold text-foreground truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                       {topic.name}
                     </h3>
                     <p className="text-sm font-medium text-muted-foreground mt-1 truncate">
                       {topic.description}
                     </p>
                   </div>
                   
                   {/* Action Icon */}
                   <div className="w-12 h-12 shrink-0 rounded-full bg-slate-50 border flex items-center justify-center ml-auto text-muted-foreground group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 shadow-sm transition-colors duration-300">
                      <ChevronRight size={20} strokeWidth={3} />
                   </div>

                </CardContent>
              </Card>
            </Link>
          ))}
        </main>
      </div>
    </div>
  );
}
