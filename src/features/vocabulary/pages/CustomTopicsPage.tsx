import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, ChevronRight, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { CreateTopicModal } from '../components/CreateTopicModal';
import { getTopics, deleteTopic, getWords, createTopic } from '../../../services/customTopicService';
import type { CustomTopic } from '../../../db/models';

interface TopicWithCount extends CustomTopic {
  wordCount: number;
}

export function CustomTopicsPage() {
  const [topics, setTopics] = useState<TopicWithCount[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  async function loadTopics() {
    const all = await getTopics();
    const withCounts = await Promise.all(
      all.map(async (t) => {
        const words = await getWords(t.id!);
        return { ...t, wordCount: words.length };
      }),
    );
    setTopics(withCounts);
    setLoading(false);
  }

  useEffect(() => { loadTopics(); }, []);

  async function handleCreate(name: string, icon: string) {
    await createTopic(name, icon);
    loadTopics();
  }

  function handleDeleteClick(e: React.MouseEvent, topicId: number) {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTarget(topicId);
  }

  async function handleDeleteConfirm() {
    if (deleteTarget == null) return;
    await deleteTopic(deleteTarget);
    setDeleteTarget(null);
    loadTopics();
  }

  return (
    <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link to="/vocabulary" className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Word Lists</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create custom topics and add words</p>
        </div>
      </div>

      <Button onClick={() => setShowCreate(true)} className="w-full gap-2">
        <Plus size={18} />
        Create New Topic
      </Button>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[72px] rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 mb-4">
            <FolderOpen size={28} className="text-indigo-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No custom topics yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Create one to start building your vocabulary</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {topics.map((topic, i) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/vocabulary/custom/${topic.id}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:shadow-md group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-2xl shadow-sm">
                  {topic.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{topic.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{topic.wordCount} words</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDeleteClick(e, topic.id!)}
                    className="p-2 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                  <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      <CreateTopicModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      <ConfirmDialog
        open={deleteTarget != null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete topic?"
        description="This will permanently delete this topic and all its words. This action cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  );
}
