// ─────────────────────────────────────────────
// الأنواع الأساسية — مبنية على JSONB من Supabase
// أي حقل تضيفه في الـ JSON يُقبل تلقائياً
// ─────────────────────────────────────────────

export type LiveMatch = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;      // URL صورة أو إيموجي
  awayLogo: string;      // URL صورة أو إيموجي
  homeScore: number;
  awayScore: number;
  minute: number;
  competition: string;
  playerId: 1 | 2;
  // حقول اختيارية جاهزة
  badge?: string;        // مثل "نهائي" أو "el-clasico"
  extraInfo?: string;    // نص حر تحت الكارت
  thumbnail?: string;    // صورة خلفية للكارت (مستقبلاً)
  channel?: string;      // اسم القناة
  tags?: string[];       // وسوم
  [key: string]: any;   // ← أي حقل مستقبلي يُقبل بدون تغيير في الكود
};

export type FinishedMatch = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeScore: number;
  awayScore: number;
  date: string;
  competition: string;
  extraInfo?: string;
  thumbnail?: string;
  [key: string]: any;
};

// نوع السطر كما يأتي من Supabase
export type MatchRow = {
  id: number;
  type: 'live' | 'finished';
  data: LiveMatch | FinishedMatch;
  sort_order: number;
  is_active: boolean;
};

// نوع مشغّل الفيديو
export type VideoPlayer = {
  id: number;
  player_name: string;
  stream_url: string;
  is_active: boolean;
};
