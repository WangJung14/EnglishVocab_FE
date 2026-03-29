import { FEATURES } from '@/constants';
import { Section } from '@/components/common/Section';

export function Features() {
  return (
    <Section
      id="features"
      title="Tại sao chọn EnglishHub?"
      subtitle="Chúng tôi cung cấp giải pháp học tiếng Anh toàn diện"
      className="bg-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {FEATURES.map((feature) => (
          <div
            key={feature.id}
            className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
