import { useParams } from 'react-router';
import { SpeedListeningSession } from '../components/SpeedListeningSession';

export function SpeedListeningPage() {
  const { topic } = useParams<{ topic: string }>();
  if (!topic) return null;
  return <SpeedListeningSession topic={topic} />;
}
