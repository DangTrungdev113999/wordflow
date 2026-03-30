import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { BookOpen, X } from 'lucide-react';

interface TenseInfo {
  id: string;
  name: string;
  period: 'past' | 'present' | 'future';
  structure: string;
  usage: string[];
  examples: { en: string; vi: string }[];
  lessonId?: string;
  color: string;
  colorBg: string;
  colorText: string;
  colorBorder: string;
}

const TENSES: TenseInfo[] = [
  // PAST
  {
    id: 'past-simple',
    name: 'Past Simple',
    period: 'past',
    structure: 'S + V-ed / V2',
    usage: ['Hành động đã xảy ra và kết thúc trong quá khứ', 'Chuỗi hành động liên tiếp'],
    examples: [
      { en: 'I visited Paris last summer.', vi: 'Tôi đã đến Paris mùa hè năm ngoái.' },
      { en: 'She cooked dinner and watched TV.', vi: 'Cô ấy nấu ăn rồi xem TV.' },
    ],
    lessonId: 'past-simple',
    color: 'indigo',
    colorBg: 'bg-indigo-50 dark:bg-indigo-900/30',
    colorText: 'text-indigo-700 dark:text-indigo-400',
    colorBorder: 'border-indigo-200 dark:border-indigo-800',
  },
  {
    id: 'past-continuous',
    name: 'Past Continuous',
    period: 'past',
    structure: 'S + was/were + V-ing',
    usage: ['Hành động đang xảy ra tại một thời điểm trong quá khứ', 'Hành động bị xen ngang'],
    examples: [
      { en: 'I was reading at 9 PM last night.', vi: 'Tôi đang đọc sách lúc 9 giờ tối qua.' },
      { en: 'She was cooking when the phone rang.', vi: 'Cô ấy đang nấu ăn thì điện thoại reo.' },
    ],
    lessonId: 'past-continuous',
    color: 'blue',
    colorBg: 'bg-blue-50 dark:bg-blue-900/30',
    colorText: 'text-blue-700 dark:text-blue-400',
    colorBorder: 'border-blue-200 dark:border-blue-800',
  },
  {
    id: 'past-perfect',
    name: 'Past Perfect',
    period: 'past',
    structure: 'S + had + V3',
    usage: ['Hành động xảy ra trước một hành động khác trong quá khứ'],
    examples: [
      { en: 'I had eaten before she arrived.', vi: 'Tôi đã ăn xong trước khi cô ấy đến.' },
      { en: 'By the time he came, we had left.', vi: 'Khi anh ấy đến thì chúng tôi đã đi rồi.' },
    ],
    color: 'violet',
    colorBg: 'bg-violet-50 dark:bg-violet-900/30',
    colorText: 'text-violet-700 dark:text-violet-400',
    colorBorder: 'border-violet-200 dark:border-violet-800',
  },
  // PRESENT
  {
    id: 'present-simple',
    name: 'Present Simple',
    period: 'present',
    structure: 'S + V(s/es)',
    usage: ['Thói quen, hành động lặp lại', 'Sự thật hiển nhiên, chân lý'],
    examples: [
      { en: 'She drinks coffee every morning.', vi: 'Cô ấy uống cà phê mỗi sáng.' },
      { en: 'The Earth revolves around the Sun.', vi: 'Trái Đất quay quanh Mặt Trời.' },
    ],
    lessonId: 'present-simple',
    color: 'emerald',
    colorBg: 'bg-emerald-50 dark:bg-emerald-900/30',
    colorText: 'text-emerald-700 dark:text-emerald-400',
    colorBorder: 'border-emerald-200 dark:border-emerald-800',
  },
  {
    id: 'present-continuous',
    name: 'Present Continuous',
    period: 'present',
    structure: 'S + am/is/are + V-ing',
    usage: ['Hành động đang xảy ra ngay lúc nói', 'Kế hoạch tương lai gần'],
    examples: [
      { en: 'She is drinking coffee right now.', vi: 'Cô ấy đang uống cà phê.' },
      { en: 'We are meeting the client tomorrow.', vi: 'Ngày mai chúng tôi gặp khách hàng.' },
    ],
    lessonId: 'present-continuous',
    color: 'teal',
    colorBg: 'bg-teal-50 dark:bg-teal-900/30',
    colorText: 'text-teal-700 dark:text-teal-400',
    colorBorder: 'border-teal-200 dark:border-teal-800',
  },
  {
    id: 'present-perfect',
    name: 'Present Perfect',
    period: 'present',
    structure: 'S + have/has + V3',
    usage: ['Hành động đã xảy ra nhưng không xác định thời gian', 'Kinh nghiệm, trải nghiệm'],
    examples: [
      { en: 'I have been to Japan.', vi: 'Tôi đã từng đến Nhật.' },
      { en: 'She has just finished her homework.', vi: 'Cô ấy vừa làm xong bài tập.' },
    ],
    lessonId: 'present-perfect',
    color: 'cyan',
    colorBg: 'bg-cyan-50 dark:bg-cyan-900/30',
    colorText: 'text-cyan-700 dark:text-cyan-400',
    colorBorder: 'border-cyan-200 dark:border-cyan-800',
  },
  {
    id: 'present-perfect-continuous',
    name: 'Present Perfect Continuous',
    period: 'present',
    structure: 'S + have/has + been + V-ing',
    usage: ['Nhấn mạnh quá trình, thời gian kéo dài', 'Giải thích tình trạng hiện tại'],
    examples: [
      { en: 'I have been reading for two hours.', vi: 'Tôi đã đọc được hai tiếng rồi.' },
      { en: 'Your eyes are red. Have you been crying?', vi: 'Mắt bạn đỏ. Bạn khóc à?' },
    ],
    color: 'sky',
    colorBg: 'bg-sky-50 dark:bg-sky-900/30',
    colorText: 'text-sky-700 dark:text-sky-400',
    colorBorder: 'border-sky-200 dark:border-sky-800',
  },
  // FUTURE
  {
    id: 'future-simple',
    name: 'Future Simple (Will)',
    period: 'future',
    structure: 'S + will + V',
    usage: ['Quyết định tại thời điểm nói', 'Lời hứa, dự đoán cá nhân'],
    examples: [
      { en: "I'll have the chicken, please.", vi: 'Cho tôi gà nhé. (quyết định ngay)' },
      { en: 'I think it will rain tomorrow.', vi: 'Tôi nghĩ ngày mai trời sẽ mưa.' },
    ],
    lessonId: 'future-simple',
    color: 'amber',
    colorBg: 'bg-amber-50 dark:bg-amber-900/30',
    colorText: 'text-amber-700 dark:text-amber-400',
    colorBorder: 'border-amber-200 dark:border-amber-800',
  },
  {
    id: 'going-to',
    name: 'Going to',
    period: 'future',
    structure: 'S + am/is/are + going to + V',
    usage: ['Kế hoạch đã quyết định từ trước', 'Dự đoán dựa trên bằng chứng'],
    examples: [
      { en: "I'm going to study medicine next year.", vi: 'Năm sau tôi sẽ học y.' },
      { en: "Look at those clouds! It's going to rain.", vi: 'Nhìn mây kìa! Trời sắp mưa.' },
    ],
    color: 'orange',
    colorBg: 'bg-orange-50 dark:bg-orange-900/30',
    colorText: 'text-orange-700 dark:text-orange-400',
    colorBorder: 'border-orange-200 dark:border-orange-800',
  },
];

const PERIOD_STYLES = {
  past: { label: 'PAST', headerBg: 'bg-indigo-500', dot: 'bg-indigo-500' },
  present: { label: 'NOW', headerBg: 'bg-emerald-500', dot: 'bg-emerald-500' },
  future: { label: 'FUTURE', headerBg: 'bg-amber-500', dot: 'bg-amber-500' },
} as const;

export function TenseOverview() {
  const [activeTense, setActiveTense] = useState<string | null>(null);
  const active = activeTense ? TENSES.find(t => t.id === activeTense) : null;

  return (
    <div className="space-y-5">
      {/* Timeline visual (horizontal on desktop, vertical on mobile) */}
      <div className="relative bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950/20 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 overflow-hidden">
        {/* Horizontal timeline (desktop) */}
        <div className="hidden md:block">
          <svg viewBox="0 0 700 40" className="w-full h-auto mb-4" aria-hidden="true">
            <motion.line
              x1="20" y1="20" x2="680" y2="20"
              stroke="currentColor" className="text-gray-300 dark:text-gray-600"
              strokeWidth="2" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
            <motion.polygon points="680,14 692,20 680,26" fill="currentColor" className="text-gray-300 dark:text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
            {/* Epoch marks */}
            {[
              { x: 120, label: 'PAST' },
              { x: 350, label: 'NOW' },
              { x: 580, label: 'FUTURE' },
            ].map((ep, i) => (
              <motion.g key={ep.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.15 }}>
                <line x1={ep.x} y1="12" x2={ep.x} y2="28" stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="2" />
                <text x={ep.x} y="38" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize="10" fontWeight="700" letterSpacing="0.05em">{ep.label}</text>
              </motion.g>
            ))}
          </svg>

          {/* Tense cards in 3 columns */}
          <div className="grid grid-cols-3 gap-4">
            {(['past', 'present', 'future'] as const).map(period => (
              <div key={period} className="space-y-2">
                {TENSES.filter(t => t.period === period).map((tense, i) => (
                  <motion.button
                    key={tense.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    onClick={() => setActiveTense(activeTense === tense.id ? null : tense.id)}
                    aria-expanded={activeTense === tense.id}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${activeTense === tense.id
                      ? `${tense.colorBg} ${tense.colorBorder} shadow-sm`
                      : 'bg-white dark:bg-gray-800/60 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}
                  >
                    <span className={`text-sm font-semibold ${activeTense === tense.id ? tense.colorText : 'text-gray-800 dark:text-gray-200'}`}>
                      {tense.name}
                    </span>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">{tense.structure}</p>
                  </motion.button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Vertical timeline (mobile) */}
        <div className="md:hidden space-y-5">
          {(['past', 'present', 'future'] as const).map(period => {
            const pStyle = PERIOD_STYLES[period];
            const periodTenses = TENSES.filter(t => t.period === period);
            return (
              <div key={period}>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className={`w-3 h-3 rounded-full ${pStyle.dot}`} />
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{pStyle.label}</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="space-y-2 pl-5 border-l-2 border-gray-200 dark:border-gray-700 ml-1.5">
                  {periodTenses.map((tense, i) => (
                    <motion.button
                      key={tense.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      onClick={() => setActiveTense(activeTense === tense.id ? null : tense.id)}
                      aria-expanded={activeTense === tense.id}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${activeTense === tense.id
                        ? `${tense.colorBg} ${tense.colorBorder} shadow-sm`
                        : 'bg-white dark:bg-gray-800/60 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}
                    >
                      <span className={`text-sm font-semibold ${activeTense === tense.id ? tense.colorText : 'text-gray-800 dark:text-gray-200'}`}>
                        {tense.name}
                      </span>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">{tense.structure}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tense detail popup */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className={`rounded-2xl border p-5 space-y-3 ${active.colorBg} ${active.colorBorder}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-lg font-bold ${active.colorText}`}>{active.name}</h3>
                <p className={`font-mono text-sm mt-0.5 ${active.colorText} opacity-70`}>{active.structure}</p>
              </div>
              <button onClick={() => setActiveTense(null)} aria-label="Đóng chi tiết thì" className="w-7 h-7 rounded-lg bg-white/60 dark:bg-gray-800/60 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-colors">
                <X size={14} className="text-gray-500" />
              </button>
            </div>

            {/* Usage */}
            <ul className="space-y-1.5">
              {active.usage.map((u, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${PERIOD_STYLES[active.period].dot}`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{u}</span>
                </li>
              ))}
            </ul>

            {/* Examples */}
            <div className="space-y-2 pt-1">
              {active.examples.map((ex, i) => (
                <div key={i} className="bg-white/50 dark:bg-gray-900/30 rounded-lg px-3 py-2">
                  <p className={`text-sm font-medium ${active.colorText}`}>{ex.en}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-0.5">{ex.vi}</p>
                </div>
              ))}
            </div>

            {/* Link to grammar lesson */}
            {active.lessonId && (
              <Link
                to={`/grammar/${active.lessonId}`}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 ${active.colorText} border ${active.colorBorder} transition-colors`}
              >
                <BookOpen size={13} />
                Xem bài học chi tiết
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
