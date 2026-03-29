import { TESTIMONIALS } from '@/constants';
import { Section } from '@/components/common/Section';

export function Testimonials() {
  return (
    <Section
      id="testimonials"
      title="Người Học Nói Gì Về Chúng Tôi"
      subtitle="Hàng nghìn học viên đã tin tưởng EnglishHub và đạt được mục tiêu của họ"
      className="bg-gray-50"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 flex flex-col"
          >
            <p className="text-gray-600 leading-relaxed mb-6 flex-1">
              "{testimonial.content}"
            </p>
            
            <div className="flex items-center gap-4">
              <div className="text-4xl">{testimonial.avatar}</div>
              <div>
                <p className="font-bold text-gray-900">
                  {testimonial.author}
                </p>
                <p className="text-sm text-gray-500">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
