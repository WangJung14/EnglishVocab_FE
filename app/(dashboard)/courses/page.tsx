import Link from 'next/link';
import { cookies } from 'next/headers';
import { Folder, Book, PlayCircle, Trophy, Sparkles, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getMockCategories, CategoryData } from '@/lib/mockData';

const API_BASE = 'http://localhost:8080/api/v1';

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value || '';
}

async function serverFetch(endpoint: string) {
  const token = await getToken();
  if (!token) throw new Error('Cần đăng nhập để xem danh sách khóa học.');

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 } // Tái xác thực cache mỗi 1 tiếng vì danh mục ít thay đổi
  });
  const data = await res.json();
  if (data.code !== 1073741824 && data.code !== 1000) {
    throw new Error(data.message || `Lỗi tải nội dung từ ${endpoint}`);
  }
  return data.result;
}

export const metadata = {
  title: 'Khám phá Khóa học - EnglishHub',
  description: 'Danh sách các chuyên mục và lộ trình học tập ngoại ngữ từ sơ cấp đến cao cấp.',
};

const IconMapping: Record<string, any> = {
  'Folder': Folder,
  'Book': Book,
  'PlayCircle': PlayCircle,
  'Trophy': Trophy,
  'Sparkles': Sparkles
};

export default async function CoursesPage() {
  let categories: CategoryData[] = [];
  
  try {
    categories = await serverFetch('/categories');
  } catch (error) {
    // Luân chuyển Fallback Mock Data để Bypass khi API Backend trả lỗi
    console.log("-> Bypass Fallback Data cho /categories");
    categories = getMockCategories();
  }

  // Lọc chỉ lấy categories đang active
  const activeCategories = categories.filter(c => c.active);
  activeCategories.sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Lời chào & Tựa đề */}
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
             Khám phá <span className="text-sky-500">Lộ trình học</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl">
             Trải nghiệm các khóa học được thiết kế chuyên biệt để giúp bạn chinh phục mọi chứng chỉ ngôn ngữ.
          </p>
        </header>

        {/* Grid Categories */}
        {activeCategories.length === 0 ? (
          <div className="text-center py-20 bg-background border-2 border-dashed rounded-3xl">
             <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
             <h3 className="text-xl font-bold">Chưa có danh mục nào</h3>
             <p className="text-muted-foreground">Các khoá học đang được chuẩn bị và sẽ sớm ra mắt.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {activeCategories.map(cat => {
              const Icon = IconMapping[cat.iconUrl] || Folder;
              
              return (
                <Link key={cat.id} href={`/courses/${cat.slug}`} className="group block focus:outline-none focus:ring-4 focus:ring-sky-500/20 rounded-[2rem]">
                  <Card className="h-full bg-white dark:bg-card border-2 border-transparent hover:border-sky-500 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 transition-all rounded-[2rem] overflow-hidden group-hover:-translate-y-1">
                    <CardContent className="p-8 sm:p-10 flex flex-col h-full relative">
                      
                      {/* Hiệu ứng Background Decal mờ ảo góc phải */}
                      <div className="absolute -top-8 -right-8 text-sky-500/5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 pointer-events-none">
                         <Icon size={180} strokeWidth={1} />
                      </div>

                      <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-500 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-sky-500/20 z-10">
                        <Icon size={32} strokeWidth={2.5} />
                      </div>
                      
                      <div className="mt-auto space-y-3 z-10">
                        <h3 className="text-2xl font-black text-foreground tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed line-clamp-3">
                          {cat.description}
                        </p>
                      </div>

                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
