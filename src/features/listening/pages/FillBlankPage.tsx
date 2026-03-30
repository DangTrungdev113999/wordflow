import { useParams } from 'react-router';
import { FillBlankSession } from '../components/FillBlankSession';

export function FillBlankPage() {
  const { topic } = useParams<{ topic: string }>();
  if (!topic) return null;
  return <FillBlankSession topic={topic} />;
}
