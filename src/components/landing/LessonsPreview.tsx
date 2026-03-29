import { LESSONS } from '@/constants';
import { Section } from '@/components/common/Section';

const levelColors = {
  beginner: { badge: 'bg-green-100 text-green-800', label: 'Cơ bản' },
  intermediate: { badge: 'bg-yellow-100 text-yellow-800', label: 'Trung cấp' },
  advanced: { badge: 'bg-blue-100 text-blue-800', label: 'Nâng cao' },
};

export function LessonsPreview() {
  return (
    <Section
      id="lessons"
      title="Bài Học Của Chúng Tôi"
      subtitle="Khám phá các bài học được thiết kế để giúp bạn tiến bộ"
      className="bg-gray-50"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LESSONS.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex-1">
                {lesson.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-2 ${
                  levelColors[lesson.level].badge
                }`}
              >
                {levelColors[lesson.level].label}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {lesson.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
