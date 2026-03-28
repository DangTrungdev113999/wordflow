import { useState, useEffect, useCallback, useRef } from 'react';
import { Eye, EyeOff, CheckCircle, XCircle, Circle, Loader2, ChevronDown, ChevronUp, ExternalLink, ShieldAlert } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ProviderConfig {
  id: 'gemini' | 'groq';
  name: string;
  label: string;
  icon: string;
  keyUrl: string;
  steps: string[];
  required: boolean;
  placeholder: string;
  storageKey: string;
  testUrl: (key: string) => { url: string; headers?: Record<string, string> };
}

type KeyStatus = 'none' | 'testing' | 'valid' | 'invalid';

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'gemini',
    name: 'Gemini',
    label: 'Chính',
    icon: '🤖',
    keyUrl: 'https://aistudio.google.com/apikey',
    steps: [
      'Truy cập Google AI Studio',
      'Đăng nhập bằng tài khoản Google',
      'Nhấn "Create API Key"',
      'Copy key và dán vào ô trên',
    ],
    required: true,
    placeholder: 'AIza...',
    storageKey: 'wordflow_gemini_api_key',
    testUrl: (key) => ({
      url: `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
    }),
  },
  {
    id: 'groq',
    name: 'Groq',
    label: 'Dự phòng — không bắt buộc',
    icon: '⚡',
    keyUrl: 'https://console.groq.com/keys',
    steps: [
      'Truy cập Groq Console',
      'Đăng ký tài khoản (miễn phí)',
      'Vào Settings → API Keys',
      'Nhấn "Create API Key"',
      'Copy key và dán vào ô trên',
    ],
    required: false,
    placeholder: 'gsk_...',
    storageKey: 'wordflow_groq_api_key',
    testUrl: (key) => ({
      url: 'https://api.groq.com/openai/v1/models',
      headers: { Authorization: `Bearer ${key}` },
    }),
  },
];

function StatusBadge({ status }: { status: KeyStatus }) {
  switch (status) {
    case 'valid':
      return (
        <span className="inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
          <CheckCircle size={16} /> Đã kết nối
        </span>
      );
    case 'invalid':
      return (
        <span className="inline-flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400">
          <XCircle size={16} /> Key không hợp lệ
        </span>
      );
    case 'testing':
      return (
        <span className="inline-flex items-center gap-1.5 text-sm text-blue-500 dark:text-blue-400">
          <Loader2 size={16} className="animate-spin" /> Đang kiểm tra...
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
          <Circle size={16} /> Chưa cài đặt
        </span>
      );
  }
}

function ProviderCard({ provider }: { provider: ProviderConfig }) {
  const [key, setKey] = useState(() => localStorage.getItem(provider.storageKey) ?? '');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<KeyStatus>(() => (key ? 'valid' : 'none'));
  const [instructionsOpen, setInstructionsOpen] = useState(!key);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const saveKey = useCallback(
    (value: string) => {
      if (value) {
        localStorage.setItem(provider.storageKey, value);
      } else {
        localStorage.removeItem(provider.storageKey);
        setStatus('none');
      }
    },
    [provider.storageKey],
  );

  const handleChange = (value: string) => {
    setKey(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveKey(value), 500);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const testConnection = async () => {
    if (!key) return;
    setStatus('testing');
    try {
      const { url, headers } = provider.testUrl(key);
      const res = await fetch(url, { headers });
      setStatus(res.ok ? 'valid' : 'invalid');
    } catch {
      setStatus('invalid');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{provider.icon}</span>
          <h4 className="font-semibold text-gray-900 dark:text-white">{provider.name}</h4>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            {provider.label}
          </span>
        </div>
        <StatusBadge status={status} />
      </div>

      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">API Key</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={provider.placeholder}
            className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button
          onClick={testConnection}
          disabled={!key || status === 'testing'}
          className={cn(
            'px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
            key
              ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed',
          )}
        >
          Test
        </button>
      </div>

      {/* Collapsible instructions */}
      <div className="mt-4">
        <button
          onClick={() => setInstructionsOpen(!instructionsOpen)}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <span>📋 Cách lấy key</span>
          {instructionsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {instructionsOpen && (
          <div className="mt-2 pl-1 space-y-1.5">
            {provider.steps.map((step, i) => (
              <p key={i} className="text-sm text-gray-500 dark:text-gray-400">
                {i + 1}. {step}
              </p>
            ))}
            <a
              href={provider.keyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 mt-1"
            >
              <ExternalLink size={14} />
              Lấy key tại đây
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export function AISettings() {
  return (
    <div id="ai">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">✨</span>
        <h3 className="font-semibold text-gray-900 dark:text-white">Cài đặt AI</h3>
      </div>

      <div className="space-y-4">
        {PROVIDERS.map((p) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
        <ShieldAlert size={18} className="text-amber-500 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-700 dark:text-amber-400">
          <p>API key chỉ lưu trên thiết bị này. Không chia sẻ key với người khác.</p>
          <p className="mt-1 text-amber-600 dark:text-amber-500">
            Cả hai provider đều miễn phí. Gemini: ~1M tokens/ngày · Groq: ~6K tokens/phút
          </p>
        </div>
      </div>
    </div>
  );
}
