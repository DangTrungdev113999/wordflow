import { useParams } from 'react-router';
import { StorySession } from '../components/StorySession';

export function StoryPage() {
  const { topic } = useParams<{ topic: string }>();
  if (!topic) return null;
  return <StorySession topic={topic} />;
}
