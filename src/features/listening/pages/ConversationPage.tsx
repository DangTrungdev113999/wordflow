import { useParams } from 'react-router';
import { ConversationSession } from '../components/ConversationSession';

export function ConversationPage() {
  const { topic } = useParams<{ topic: string }>();
  if (!topic) return null;
  return <ConversationSession topic={topic} />;
}
