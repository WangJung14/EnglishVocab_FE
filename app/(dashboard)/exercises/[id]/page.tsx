import { cookies } from 'next/headers';
import ExerciseClientUI from './ExerciseClientUI';
import { getMockExerciseMeta, getMockExerciseQuestions, ExerciseMeta, QuestionData } from '@/lib/mockData';

const API_BASE = 'http://localhost:8080/api/v1';

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value || '';
}

async function serverFetch(endpoint: string) {
  const token = await getToken();
  if (!token) throw new Error('Cần đăng nhập để làm bài tập.');

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` },
    next: { revalidate: 30 } 
  });
  const data = await res.json();
  if (data.code !== 1073741824 && data.code !== 1000) throw new Error(data.message);
  return data.result;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let title = "Làm bài tập";
  try {
     const meta = await serverFetch(`/exercises/${id}`);
     title = meta.title;
  } catch (error) {
     const mock = getMockExerciseMeta(id);
     title = mock.title;
  }
  return {
    title: `${title} - EnglishHub`,
  };
}

export default async function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await getToken(); // Pass token cắm sẵn xuống Client để fetch POST.

  // 1. GỌI PARALLEL CHUẨN BỊ DỮ LIỆU BÀI TẬP VÀ CÂU HỎI
  let exercise: ExerciseMeta;
  let questions: QuestionData[] = [];

  try {
    const [exRes, qRes] = await Promise.all([
      serverFetch(`/exercises/${id}`),
      serverFetch(`/exercises/${id}/questions`)
    ]);
    exercise = exRes;
    questions = qRes;
  } catch (err) {
    console.log(`-> Bypass: Trả mock data array cho /exercises/${id}`);
    exercise = getMockExerciseMeta(id);
    questions = getMockExerciseQuestions(id);
  }

  // Nếu bài tập rỗng câu hỏi
  if (!questions || questions.length === 0) {
    return (
       <div className="min-h-screen flex items-center justify-center p-4 text-center">
         <div>
           <h2 className="text-2xl font-black mb-2">Chưa có câu hỏi</h2>
           <p className="text-muted-foreground w-64 mx-auto">Giảng viên chưa cập nhật câu hỏi cho bài kiểm tra này. Vui lòng quay lại sau.</p>
         </div>
       </div>
    );
  }

  return (
    <ExerciseClientUI 
      exercise={exercise} 
      questions={questions} 
      exerciseId={id}
      token={token} 
    />
  );
}
