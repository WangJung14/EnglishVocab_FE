import { UserData, StatsData, LessonData, SRSData } from '@/app/(dashboard)/dashboard/page';
import { LessonDetail, WordItem, ReadingItem } from '@/app/(dashboard)/lessons/[slug]/page';

// ---------------------------------------------------------
// DASHBOARD MOCKS
// ---------------------------------------------------------

export const mockUser: UserData = {
  id: 'user-id-123',
  email: 'learner@example.com',
  firstName: 'Tuấn',
  lastName: 'Anh',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  role: 'STUDENT',
  membershipType: 'PREMIUM'
};

export const mockStats: StatsData = {
  totalLessonsStarted: 12,
  totalLessonsCompleted: 8,
  completionRate: 75.5,
  averageScore: 92.4,
  totalWordsLearned: 1540,
  reviewCount: 320
};

export const mockProgress: LessonData[] = [
  {
    id: 'mock-lesson-1',
    title: 'Bài 1: Present Simple Tense (Thì hiện tại đơn)',
    status: 'IN_PROGRESS',
    progress: 45,
    totalItems: 20,
    completedItems: 9,
    lastAccessedAt: new Date().toISOString()
  },
  {
    id: 'mock-lesson-2',
    title: 'Bài 2: Family Vocabulary (Từ vựng Gia đình)',
    status: 'COMPLETED',
    progress: 100,
    totalItems: 15,
    completedItems: 15,
    completedAt: new Date(Date.now() - 86400000).toISOString() // 1 ngày trước
  },
  {
    id: 'mock-lesson-3',
    title: 'Bài 3: Daily Routine (Thói quen hàng ngày)',
    status: 'COMPLETED',
    progress: 100,
    totalItems: 25,
    completedItems: 25,
    completedAt: new Date(Date.now() - 172800000).toISOString() // 2 ngày trước
  }
];

export const mockSrs: SRSData = {
  dueToday: 42,
  totalCardsActive: 1540,
  retentionRate: 88.5
};


// ---------------------------------------------------------
// LESSON DETAIL MOCKS
// ---------------------------------------------------------

export const getMockLessonDetail = (slug: string): LessonDetail => {
  return {
    id: slug.startsWith('mock-lesson-') ? slug : 'mock-lesson-1', // Cố tình map id bằng url slug giả mạo
    title: slug === 'mock-lesson-2' ? 'Bài 2: Family Vocabulary (Từ vựng Gia đình)' : 'Bài 1: Present Simple Tense (Thì hiện tại đơn)',
    slug: slug,
    content: 'Hôm nay chúng ta sẽ khám phá mọi chi tiết về cách sử dụng ngữ pháp Thì hiện tại đơn và áp dụng nó thông qua 20 từ vựng cốt lõi.',
    lessonType: 'VOCABULARY',
    isPublished: true
  };
};

export const getMockWords = (lessonId: string): WordItem[] => {
  if (lessonId === 'mock-lesson-2') {
    return [
      { id: 'w1', word: 'Father', meaning: 'Bố, cha (Danh từ)', displayOrder: 1 },
      { id: 'w2', word: 'Mother', meaning: 'Mẹ, má (Danh từ)', displayOrder: 2 },
      { id: 'w3', word: 'Sibling', meaning: 'Anh chị em ruột', displayOrder: 3 },
      { id: 'w4', word: 'Parent', meaning: 'Phụ huynh', displayOrder: 4 },
    ];
  }
  
  return [
    { id: '1', word: 'Always', meaning: 'Luôn luôn (Trạng từ chỉ tần suất)', displayOrder: 1 },
    { id: '2', word: 'Usually', meaning: 'Thường xuyên', displayOrder: 2 },
    { id: '3', word: 'Often', meaning: 'Thường thường', displayOrder: 3 },
    { id: '4', word: 'Sometimes', meaning: 'Thỉnh thoảng', displayOrder: 4 },
    { id: '5', word: 'Seldom', meaning: 'Hiếm khi', displayOrder: 5 },
    { id: '6', word: 'Never', meaning: 'Không bao giờ', displayOrder: 6 },
    { id: '7', word: 'Every day', meaning: 'Mỗi ngày', displayOrder: 7 },
    { id: '8', word: 'Routine', meaning: 'Thói quen, lịch trình (Danh từ)', displayOrder: 8 },
  ];
};

export const getMockReading = (lessonId: string): ReadingItem => {
  return {
    id: `reading-${lessonId}`,
    title: 'A Day in the Life of a Student',
    content: `I usually wake up at 6:00 AM every morning. After making my bed, I always brush my teeth and wash my face.
    
Then, I often go to the kitchen to prepare breakfast for my family. We sometimes eat eggs and bread. I never drink coffee because it makes me dizzy.

At 7:30 AM, I take the bus to school. My classes start at 8:00 AM and end at exactly 12:00 PM. I really enjoy my routine.`,
    translation: `Tôi thường thức dậy lúc 6 giờ sáng mỗi ngày. Sau khi dọn dẹp giường, tôi luôn đánh răng và rửa mặt.

Sau đó, tôi thường vào bếp cẩn thận chuẩn bị bữa sáng cho gia đình. Thi thoảng chúng tôi ăn trứng và bánh mì. Tôi không bao giờ uống cà phê vì nó khiến tôi bị chóng mặt.

Lúc 7:30 sáng, tôi bắt xe buýt đến trường. Các lớp học của tôi bắt đầu lúc 8:00 sáng và kết thúc chuẩn xác vào lúc 12:00 trưa. Tôi thực sự yêu thích lịch trình thói quen này của mình.`
  };
};

// ---------------------------------------------------------
// EXPLORER (COURSES) MOCKS
// ---------------------------------------------------------

export interface CategoryData {
  id: string;
  name: string; // Tên thay cho title như API Response
  slug: string;
  description: string;
  iconUrl: string; // Tên thay cho image
  displayOrder: number;
  createdAt: string;
  active: boolean;
}

export interface TopicData {
  id: string;
  name: string; // Tên thay cho title
  slug: string;
  description: string;
  level: string;
  isPublished: boolean;
  categoryName: string;
}

export interface LessonListData {
  id: string;
  title: string;
  slug: string;
  content: string;
  lessonType: string;
  isPublished: boolean;
}

export const getMockCategories = (): CategoryData[] => [
  { id: 'cat-1', name: 'TOEIC Phá Đảo', slug: 'toeic', description: 'Ôn thi TOEIC format mới với lộ trình chuẩn', iconUrl: 'Folder', displayOrder: 1, createdAt: new Date().toISOString(), active: true },
  { id: 'cat-2', name: 'IELTS Tinh Gọn', slug: 'ielts', description: 'Chinh phục IELTS 7.0+ cấp tốc', iconUrl: 'Book', displayOrder: 2, createdAt: new Date().toISOString(), active: true },
  { id: 'cat-3', name: 'Phản Xạ Giao Tiếp', slug: 'giao-tiep', description: 'Hội thoại tiếng Anh thực chiến mỗi ngày', iconUrl: 'PlayCircle', displayOrder: 3, createdAt: new Date().toISOString(), active: true },
];

export const getMockTopics = (categorySlug: string): TopicData[] => [
  { id: 'top-1', name: 'Part 1: Photographs', slug: 'part-1-photographs', description: 'Chiến thuật mô tả tranh chuẩn TOEIC', level: 'BEGINNER', isPublished: true, categoryName: 'TOEIC Phá Đảo' },
  { id: 'top-2', name: 'Part 2: Question & Response', slug: 'part-2-qr', description: 'Kỹ năng nghe hiểu câu hỏi ngắn', level: 'INTERMEDIATE', isPublished: true, categoryName: 'TOEIC Phá Đảo' },
  { id: 'top-3', name: 'Part 3: Conversations', slug: 'part-3-conv', description: 'Đoạn hội thoại đa chủ đề', level: 'ADVANCED', isPublished: true, categoryName: 'TOEIC Phá Đảo' }
];

export const getMockTopicLessons = (topicSlug: string): LessonListData[] => [
  { id: 'mock-lesson-1', title: 'Lesson 1: Common Action Verbs', slug: 'mock-lesson-1', content: 'Từ vựng hành động phổ biến', lessonType: 'VOCABULARY', isPublished: true },
  { id: 'mock-lesson-2', title: 'Lesson 2: Objects & Environment', slug: 'mock-lesson-2', content: 'Từ vựng đồ vật và môi trường', lessonType: 'VOCABULARY', isPublished: true },
  { id: 'mock-lesson-3', title: 'Lesson 3: Prepositions of Place', slug: 'mock-lesson-3', content: 'Ngữ pháp chỉ vị trí và trạng thái', lessonType: 'GRAMMAR', isPublished: true },
  { id: 'mock-lesson-4', title: 'Lesson 4: Practice Test', slug: 'mock-lesson-4', content: 'Bài kiểm tra tổng hợp', lessonType: 'PRACTICE', isPublished: true },
];

// ---------------------------------------------------------
// EXERCISES / QUIZ MOCKS
// ---------------------------------------------------------

export interface ExerciseMeta {
  id: string;
  title: string;
  description: string;
  type: string;
  displayOrder: number;
}

export interface QuestionOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface QuestionData {
  id: string;
  content: string;
  type: string;
  options: QuestionOption[];
}

export interface AttemptStartRes {
  attemptId: string;
  startTime: string;
}

export interface AttemptResult {
  id: string;
  score: number;
  maxScore: number;
  isPassed: boolean;
  status: string;
  startedAt: string;
  submittedAt: string;
  totalQuestions: number;
  correctAnswers: number;
}

export const getMockExerciseMeta = (id: string): ExerciseMeta => ({
  id: id,
  title: 'Quiz Test: Present Simple Tense',
  description: 'Kiểm tra kiến thức đã học ở bài Thì Hiện Tại Đơn với 3 câu hỏi nhanh.',
  type: 'QUIZ',
  displayOrder: 1,
});

export const getMockExerciseQuestions = (id: string): QuestionData[] => [
  {
    id: 'q1',
    content: 'Which sentence is grammatically correct?',
    type: 'MULTIPLE_CHOICE',
    options: [
      { id: 'opt1_1', content: 'She go to school every day.', isCorrect: false },
      { id: 'opt1_2', content: 'She goes to school every day.', isCorrect: true },
      { id: 'opt1_3', content: 'She going to school every day.', isCorrect: false },
      { id: 'opt1_4', content: 'She is go to school every day.', isCorrect: false },
    ]
  },
  {
    id: 'q2',
    content: 'What time _____ you usually wake up?',
    type: 'MULTIPLE_CHOICE',
    options: [
      { id: 'opt2_1', content: 'does', isCorrect: false },
      { id: 'opt2_2', content: 'do', isCorrect: true },
      { id: 'opt2_3', content: 'are', isCorrect: false },
      { id: 'opt2_4', content: 'is', isCorrect: false },
    ]
  },
  {
    id: 'q3',
    content: 'They _____ playing soccer.',
    type: 'MULTIPLE_CHOICE',
    options: [
      { id: 'opt3_1', content: 'not like', isCorrect: false },
      { id: 'opt3_2', content: 'don\'t like', isCorrect: true },
      { id: 'opt3_3', content: 'doesn\'t like', isCorrect: false },
      { id: 'opt3_4', content: 'aren\'t like', isCorrect: false },
    ]
  }
];

export const mockAttemptStart = (): AttemptStartRes => ({
  attemptId: 'mock-attempt-xyz-123',
  startTime: new Date().toISOString()
});

export const getMockAttemptResult = (score: number, total: number): AttemptResult => ({
  id: 'mock-attempt-xyz-123',
  score: parseFloat(((score / total) * 10).toFixed(1)),
  maxScore: 10,
  isPassed: score / total >= 0.5,
  status: 'COMPLETED',
  startedAt: new Date(Date.now() - 300000).toISOString(),
  submittedAt: new Date().toISOString(),
  totalQuestions: total,
  correctAnswers: score
});

