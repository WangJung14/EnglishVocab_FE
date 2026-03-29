import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
            Học Tiếng Anh Một Cách Dễ Dàng
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed text-balance">
            Khám phá phương pháp dạy học hiệu quả, được thiết kế đặc biệt cho người Việt. 
            Từ cơ bản đến nâng cao, học theo tốc độ của bạn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg">
              Bắt đầu miễn phí
            </Button>
            <Button variant="outline" size="lg">
              Xem demo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-blue-600">10K+</p>
              <p className="text-sm md:text-base text-gray-600">Học viên tích cực</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-blue-600">500+</p>
              <p className="text-sm md:text-base text-gray-600">Bài học chất lượng</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-blue-600">4.9★</p>
              <p className="text-sm md:text-base text-gray-600">Đánh giá trung bình</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
