import { useParams } from 'react-router';
import { NoteTakingSession } from '../components/NoteTakingSession';

export function NoteTakingPage() {
  const { topic } = useParams<{ topic: string }>();
  if (!topic) return null;
  return <NoteTakingSession topic={topic} />;
}
