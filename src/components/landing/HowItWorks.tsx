import { HOW_IT_WORKS } from '@/constants';
import { Section } from '@/components/common/Section';

export function HowItWorks() {
  return (
    <Section
      id="how"
      title="Cách Bắt Đầu"
      subtitle="Theo dõi bốn bước đơn giản để bắt đầu hành trình học tiếng Anh của bạn"
      className="bg-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {HOW_IT_WORKS.map((step) => (
          <div key={step.id} className="relative">
            {/* Connector line for desktop */}
            {step.number < HOW_IT_WORKS.length && (
              <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200 -z-10 transform translate-y-full"></div>
            )}

            <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg p-6 border border-gray-200 h-full">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                {step.number}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 text-center mb-3">
                {step.title}
              </h3>
              
              <p className="text-gray-600 text-center leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
