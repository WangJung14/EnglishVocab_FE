import { Container } from '@/components/common/Container';
import { Button } from '@/components/common/Button';

export function CTA() {
  return (
    <section className="py-16 md:py-24 bg-blue-600">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
            Sẵn sàng bắt đầu hành trình học tiếng Anh của bạn?
          </h2>
          
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto text-balance">
            Tham gia hàng nghìn học viên đang học tiếng Anh hiệu quả cùng EnglishHub.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Đăng ký ngay miễn phí
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-blue-500"
            >
              Liên hệ với chúng tôi
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
