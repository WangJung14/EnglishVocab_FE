export interface Flashcard {
  flashcardId: string;
  frontText: string;
  backText: string;
  example?: string;
  nextReviewDate: string;
}

export type ReviewRating = 'AGAIN' | 'HARD' | 'GOOD' | 'EASY';

export interface SRSApiResponse<T> {
  code: number;
  message: string;
  result: T;
}
