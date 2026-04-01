export type LessonPhase = 'vocab' | 'grammar' | 'quiz';

export interface Lesson {
  id: string;
  title: string;
  titleVi: string;
  vocabTopic: string;   // maps to VocabTopic.topic
  grammarId: string;    // maps to GrammarLessonData.id
  phases: LessonPhase[];
  estimatedMinutes: number;
}

export interface Unit {
  id: string;
  title: string;
  titleVi: string;
  level: 'A1' | 'A2';
  icon: string;
  gradient: string;
  lessons: Lesson[];
}
