import { Feature, Lesson, Step, Testimonial } from '../types';

export const SITE_NAME = 'EnglishHub';
export const SITE_DESCRIPTION = 'Học tiếng Anh dễ dàng và hiệu quả';

export const FEATURES: Feature[] = [
  {
    id: 'feature-1',
    title: 'Bài học toàn diện',
    description: 'Từ cơ bản đến nâng cao, bao gồm ngữ pháp, từ vựng, và kỹ năng giao tiếp.',
    icon: '📚',
  },
  {
    id: 'feature-2',
    title: 'Giáo viên giàu kinh nghiệm',
    description: 'Các giáo viên bản xứ và chuyên gia hướng dẫn học tập của bạn.',
    icon: '👨‍🏫',
  },
  {
    id: 'feature-3',
    title: 'Phương pháp tương tác',
    description: 'Học thông qua bài tập tương tác, video, và cuộc trò chuyện thực tế.',
    icon: '🎯',
  },
  {
    id: 'feature-4',
    title: 'Học theo tốc độ của bạn',
    description: 'Linh hoạt học lúc nào muốn, ở đâu muốn, với tiến độ riêng của mình.',
    icon: '⏱️',
  },
];

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Bảng chữ cái và Âm thanh',
    description: 'Bắt đầu từ những điều cơ bản nhất với cách phát âm đúng.',
    level: 'beginner',
  },
  {
    id: 'lesson-2',
    title: 'Những câu hỏi và câu trả lời hàng ngày',
    description: 'Học các cấu trúc câu phổ biến cho cuộc sống hàng ngày.',
    level: 'beginner',
  },
  {
    id: 'lesson-3',
    title: 'Thì quá khứ hoàn thành',
    description: 'Hiểu rõ cách sử dụng thì quá khứ hoàn thành trong tiếng Anh.',
    level: 'intermediate',
  },
  {
    id: 'lesson-4',
    title: 'Viết luận học thuật',
    description: 'Phát triển kỹ năng viết luận và tài liệu học thuật.',
    level: 'advanced',
  },
];

export const HOW_IT_WORKS: Step[] = [
  {
    id: 'step-1',
    number: 1,
    title: 'Đăng ký tài khoản',
    description: 'Tạo tài khoản miễn phí và chọn mục tiêu học của bạn.',
  },
  {
    id: 'step-2',
    number: 2,
    title: 'Chọn khóa học',
    description: 'Chọn từ các khóa học phù hợp với trình độ và mục tiêu của bạn.',
  },
  {
    id: 'step-3',
    number: 3,
    title: 'Bắt đầu học',
    description: 'Hoàn thành các bài học, bài tập, và kiểm tra tiến độ của mình.',
  },
  {
    id: 'step-4',
    number: 4,
    title: 'Nhận chứng chỉ',
    description: 'Hoàn thành khóa học và nhận chứng chỉ kỹ năng tiếng Anh.',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'testimonial-1',
    author: 'Nguyễn Thị Lan',
    role: 'Học sinh',
    content: 'EnglishHub giúp tôi cải thiện kỹ năng tiếng Anh rất nhanh. Bài học rất hay và dễ hiểu!',
    avatar: '👩‍🎓',
  },
  {
    id: 'testimonial-2',
    author: 'Trần Hoàng Minh',
    role: 'Chuyên viên Marketing',
    content: 'Tôi đã hoàn thành khóa học IELTS và đạt được điểm số mục tiêu. Cảm ơn EnglishHub!',
    avatar: '👨‍💼',
  },
  {
    id: 'testimonial-3',
    author: 'Phạm Thị Hồng',
    role: 'Sinh viên Đại học',
    content: 'Phương pháp dạy rất chuyên nghiệp. Tôi tự tin hơn rất nhiều khi nói tiếng Anh.',
    avatar: '👩‍🎓',
  },
];
