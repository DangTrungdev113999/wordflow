import { useParams } from 'react-router';
import { ListenChooseSession } from '../components/ListenChooseSession';

export function ListenChoosePage() {
  const { topic } = useParams<{ topic: string }>();
  if (!topic) return null;
  return <ListenChooseSession topic={topic} />;
}
