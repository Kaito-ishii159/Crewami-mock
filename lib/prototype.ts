export type Role = 'ADMIN' | 'MEMBER';
export type Locale = 'ja' | 'en';
export type FeatureKey = 'SHIFT_COLLECTION' | 'SCHEDULE' | 'ATTENDANCE' | 'OPEN_SHIFTS' | 'GPS' | 'ESTIMATED_PAY';
export type Plan = 'COLLECTION' | 'FULL';
export type SubscriptionStatus = 'trial' | 'active' | 'expired';
export type StaffStatus = 'INVITED' | 'ACTIVE' | 'DISABLED';
export type Scenario =
  | 'normal'
  | 'collecting'
  | 'building'
  | 'working'
  | 'shortage'
  | 'trial'
  | 'expired'
  | 'collectionPlan'
  | 'fullPlan';

export type Screen =
  | 'login'
  | 'forgotPassword'
  | 'passwordReset'
  | 'inviteSetPassword'
  | 'home'
  | 'collection'
  | 'availabilityRequest'
  | 'availability'
  | 'builder'
  | 'publish'
  | 'schedule'
  | 'attendance'
  | 'teamAttendance'
  | 'attendanceHistory'
  | 'attendanceDetail'
  | 'correction'
  | 'correctionReview'
  | 'openShifts'
  | 'gps'
  | 'staff'
  | 'staffDetail'
  | 'staffForm'
  | 'stores'
  | 'storeForm'
  | 'subscription'
  | 'featureSettings'
  | 'export'
  | 'customIntegration'
  | 'customQuote'
  | 'payroll'
  | 'kiosk'
  | 'notifications'
  | 'language'
  | 'settings'
  | 'feedback';

export type AttendanceState = 'before' | 'working' | 'break' | 'complete';
export type ShiftStatus = 'CONFIRMED' | 'UNCONFIRMED' | 'NO_AVAILABILITY';

export interface StaffRecord {
  id: string;
  ja: string;
  en: string;
  role: Role;
  storeId: string;
  hourlyRate: number;
  phone: string;
  email: string;
  status: StaffStatus;
  active: boolean;
  color: string;
}

export interface StoreRecord {
  id: string;
  ja: string;
  en: string;
  description: string;
}

export interface TimeRange { start: string; end: string }
export interface StaffShift { staffId: string; availability?: TimeRange; confirmed?: TimeRange }
export interface ShiftDay { id: string; ja: string; en: string; rows: StaffShift[] }

export const initialStores: StoreRecord[] = [
  { id: 'shibuya', ja: '渋谷店', en: 'Shibuya', description: 'メイン店舗' },
  { id: 'shinjuku', ja: '新宿店', en: 'Shinjuku', description: '駅前店舗' },
  { id: 'ikebukuro', ja: '池袋店', en: 'Ikebukuro', description: '西口店舗' },
];

export const initialStaff: StaffRecord[] = [
  { id: 'tanaka', ja: '田中 太郎', en: 'Taro Tanaka', email: 'tanaka@example.com', status: 'ACTIVE', role: 'MEMBER', storeId: 'shibuya', hourlyRate: 1300, phone: '090-1234-5678', active: true, color: '#2c7b73' },
  { id: 'yamada', ja: '山田 花子', en: 'Hana Yamada', email: 'yamada@example.com', status: 'ACTIVE', role: 'ADMIN', storeId: 'shibuya', hourlyRate: 1450, phone: '090-2345-6789', active: true, color: '#ef8c62' },
  { id: 'suzuki', ja: '鈴木 一郎', en: 'Ichiro Suzuki', email: 'suzuki@example.com', status: 'INVITED', role: 'MEMBER', storeId: 'shinjuku', hourlyRate: 1280, phone: '', active: true, color: '#6d6ab7' },
  { id: 'sato', ja: '佐藤 美咲', en: 'Misaki Sato', email: 'sato@example.com', status: 'ACTIVE', role: 'MEMBER', storeId: 'shibuya', hourlyRate: 1350, phone: '080-4567-8901', active: true, color: '#d66982' },
  { id: 'takahashi', ja: '高橋 健', en: 'Ken Takahashi', email: 'takahashi@example.com', status: 'ACTIVE', role: 'MEMBER', storeId: 'ikebukuro', hourlyRate: 1320, phone: '', active: true, color: '#c79036' },
  { id: 'ito', ja: '伊藤 葵', en: 'Aoi Ito', email: 'ito@example.com', status: 'DISABLED', role: 'MEMBER', storeId: 'shibuya', hourlyRate: 1300, phone: '', active: false, color: '#4f86a8' },
];

export const featureLabels: Record<FeatureKey, { ja: string; en: string }> = {
  SHIFT_COLLECTION: { ja: 'シフト収集', en: 'Shift collection' },
  SCHEDULE: { ja: 'シフト管理', en: 'Schedule' },
  ATTENDANCE: { ja: '勤怠管理', en: 'Attendance' },
  OPEN_SHIFTS: { ja: '緊急募集', en: 'Open shifts' },
  GPS: { ja: 'GPS', en: 'GPS' },
  ESTIMATED_PAY: { ja: '給与概算', en: 'Estimated pay' },
};

export const allFeatures = Object.keys(featureLabels) as FeatureKey[];

export type FeatureFlags = Record<FeatureKey, boolean>;

export const defaultAdminEnabledFeatures: FeatureFlags = {
  SHIFT_COLLECTION: true,
  SCHEDULE: true,
  ATTENDANCE: true,
  OPEN_SHIFTS: true,
  GPS: true,
  ESTIMATED_PAY: true,
};

export function getPlanEntitlements(status: SubscriptionStatus, plan: Plan | null): FeatureFlags {
  if (status === 'trial') return { ...defaultAdminEnabledFeatures };
  if (status === 'expired' || !plan) return Object.fromEntries(allFeatures.map((feature) => [feature, false])) as FeatureFlags;
  if (plan === 'COLLECTION') return {
    SHIFT_COLLECTION: true,
    SCHEDULE: false,
    ATTENDANCE: false,
    OPEN_SHIFTS: false,
    GPS: false,
    ESTIMATED_PAY: false,
  };
  return { ...defaultAdminEnabledFeatures };
}

export function getEffectiveFeatures(entitlements: FeatureFlags, enabled: FeatureFlags): FeatureFlags {
  return Object.fromEntries(allFeatures.map((feature) => [feature, entitlements[feature] && enabled[feature]])) as FeatureFlags;
}

export function calculateMonthlyPrice(plan: Plan, activeUsers: number): number {
  const blocks = Math.max(1, Math.ceil(activeUsers / 100));
  return blocks * (plan === 'COLLECTION' ? 500 : 4980);
}

export function userLimitLabel(activeUsers: number): number {
  return Math.max(100, Math.ceil(activeUsers / 100) * 100);
}

const dayRows: StaffShift[][] = [
  [
    { staffId: 'tanaka', availability: { start: '09:00', end: '18:00' }, confirmed: { start: '09:00', end: '17:00' } },
    { staffId: 'yamada', availability: { start: '12:00', end: '20:00' }, confirmed: { start: '13:00', end: '20:00' } },
    { staffId: 'sato', availability: { start: '10:00', end: '16:00' } },
    { staffId: 'takahashi', availability: { start: '17:00', end: '22:00' } },
    { staffId: 'suzuki' },
    { staffId: 'ito' },
  ],
  [
    { staffId: 'tanaka', availability: { start: '18:00', end: '23:00' }, confirmed: { start: '18:00', end: '23:00' } },
    { staffId: 'sato', availability: { start: '09:00', end: '15:00' }, confirmed: { start: '10:00', end: '15:00' } },
    { staffId: 'yamada', availability: { start: '12:00', end: '21:00' } },
    { staffId: 'ito', availability: { start: '16:00', end: '22:00' } },
    { staffId: 'suzuki' },
    { staffId: 'takahashi' },
  ],
  [
    { staffId: 'yamada', availability: { start: '08:00', end: '17:00' }, confirmed: { start: '09:00', end: '17:00' } },
    { staffId: 'takahashi', availability: { start: '17:00', end: '23:30' }, confirmed: { start: '18:00', end: '23:30' } },
    { staffId: 'tanaka', availability: { start: '12:00', end: '20:00' } },
    { staffId: 'suzuki', availability: { start: '00:00', end: '05:00' } },
    { staffId: 'sato' },
    { staffId: 'ito' },
  ],
  [
    { staffId: 'sato', availability: { start: '10:00', end: '18:00' }, confirmed: { start: '10:00', end: '18:00' } },
    { staffId: 'ito', availability: { start: '15:00', end: '22:00' }, confirmed: { start: '16:00', end: '22:00' } },
    { staffId: 'tanaka', availability: { start: '09:00', end: '17:00' } },
    { staffId: 'yamada', availability: { start: '12:00', end: '20:00' } },
    { staffId: 'suzuki' },
    { staffId: 'takahashi' },
  ],
];

export const initialShiftDays: ShiftDay[] = [
  { id: '2026-11-10', ja: '11月10日（火）', en: 'Tue, Nov 10', rows: dayRows[0] },
  { id: '2026-11-11', ja: '11月11日（水）', en: 'Wed, Nov 11', rows: dayRows[1] },
  { id: '2026-11-12', ja: '11月12日（木）', en: 'Thu, Nov 12', rows: dayRows[2] },
  { id: '2026-11-13', ja: '11月13日（金）', en: 'Fri, Nov 13', rows: dayRows[3] },
];

export function getShiftStatus(row: StaffShift): ShiftStatus {
  if (row.confirmed) return 'CONFIRMED';
  if (row.availability) return 'UNCONFIRMED';
  return 'NO_AVAILABILITY';
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function rangeStyle(range: TimeRange) {
  const start = timeToMinutes(range.start);
  const end = timeToMinutes(range.end);
  return { left: `${(start / 1440) * 100}%`, width: `${((end - start) / 1440) * 100}%` };
}

export function translate(locale: Locale, japanese: string, english: string) {
  return locale === 'ja' ? japanese : english;
}

export const scenarioLabels: Record<Scenario, { ja: string; en: string }> = {
  normal: { ja: '通常', en: 'Normal' },
  collecting: { ja: '希望収集中', en: 'Collecting availability' },
  building: { ja: 'シフト作成中', en: 'Building schedule' },
  working: { ja: '勤務中', en: 'Clocked in' },
  shortage: { ja: '欠員あり', en: 'Staff shortage' },
  trial: { ja: '無料体験中', en: 'Free trial' },
  expired: { ja: '無料体験終了', en: 'Trial expired' },
  collectionPlan: { ja: 'シフト収集プラン', en: 'Collection plan' },
  fullPlan: { ja: '全機能プラン', en: 'Full plan' },
};
