export type Role = 'OWNER' | 'MANAGER' | 'MEMBER';
export type Locale = 'ja' | 'en';
export type Scenario =
  | 'normal'
  | 'collecting'
  | 'building'
  | 'shortage'
  | 'working'
  | 'break'
  | 'unpaid'
  | 'trial'
  | 'paid';

export type Screen =
  | 'home'
  | 'collection'
  | 'availability'
  | 'builder'
  | 'publish'
  | 'schedule'
  | 'attendance'
  | 'teamAttendance'
  | 'openShifts'
  | 'gps'
  | 'staff'
  | 'staffDetail'
  | 'stores'
  | 'subscription'
  | 'payroll'
  | 'correction'
  | 'kiosk'
  | 'settings'
  | 'feedback';

export type AttendanceState = 'before' | 'working' | 'break' | 'complete';

export const stores = {
  ja: ['渋谷店', '新宿店', '池袋店'],
  en: ['Shibuya', 'Shinjuku', 'Ikebukuro'],
} as const;

export const people = [
  { ja: '田中 太郎', en: 'Taro Tanaka', role: 'MEMBER', store: 0, color: '#2c7b73' },
  { ja: '山田 花子', en: 'Hana Yamada', role: 'MANAGER', store: 0, color: '#ef8c62' },
  { ja: '鈴木 一郎', en: 'Ichiro Suzuki', role: 'MEMBER', store: 1, color: '#6d6ab7' },
  { ja: '佐藤 美咲', en: 'Misaki Sato', role: 'MEMBER', store: 0, color: '#d66982' },
  { ja: '高橋 健', en: 'Ken Takahashi', role: 'MEMBER', store: 2, color: '#c79036' },
] as const;

export function translate(locale: Locale, japanese: string, english: string) {
  return locale === 'ja' ? japanese : english;
}

export const scenarioLabels: Record<Scenario, { ja: string; en: string }> = {
  normal: { ja: '通常状態', en: 'Normal' },
  collecting: { ja: 'シフト募集中', en: 'Collecting availability' },
  building: { ja: 'シフト作成中', en: 'Building schedule' },
  shortage: { ja: '欠員あり', en: 'Staff shortage' },
  working: { ja: '勤務中', en: 'Clocked in' },
  break: { ja: '休憩中', en: 'On break' },
  unpaid: { ja: '未課金', en: 'No subscription' },
  trial: { ja: '無料体験中', en: 'Free trial' },
  paid: { ja: '課金済み', en: 'Subscribed' },
};
