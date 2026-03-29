import { SITE_NAME } from '@/constants';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <Container className="flex items-center justify-between h-16 md:h-20">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-600">{SITE_NAME}</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-700 hover:text-blue-600 transition">
            Tính năng
          </a>
          <a href="#lessons" className="text-gray-700 hover:text-blue-600 transition">
            Bài học
          </a>
          <a href="#how" className="text-gray-700 hover:text-blue-600 transition">
            Cách thức
          </a>
          <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">
            Đánh giá
          </a>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Đăng nhập
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">
              Đăng ký
            </Button>
          </Link>
        </div>
      </Container>
    </nav>
  );
}
