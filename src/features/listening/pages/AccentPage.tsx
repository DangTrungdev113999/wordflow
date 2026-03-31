import { useParams } from 'react-router';
import { AccentExposureSession } from '../components/AccentExposureSession';

export function AccentPage() {
  const { topic } = useParams<{ topic: string }>();
  if (!topic) return null;
  return <AccentExposureSession topic={topic} />;
}
