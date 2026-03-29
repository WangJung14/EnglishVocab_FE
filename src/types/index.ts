export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface Step {
  id: string;
  number: number;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  avatar: string;
}
