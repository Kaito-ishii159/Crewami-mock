'use client';

import { useState, type Dispatch, type SetStateAction } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BellRing,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Coffee,
  CreditCard,
  Crown,
  FilePenLine,
  Gift,
  Globe2,
  HelpCircle,
  Languages,
  LocateFixed,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  MapPinned,
  MessageCircleMore,
  Minus,
  Navigation,
  Plus,
  QrCode,
  ReceiptText,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  TimerReset,
  UserPlus,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { people, stores, translate, type AttendanceState, type Locale, type Role, type Scenario, type Screen } from '@/lib/prototype';
import type { ModalState } from './CrewamiPrototype';

interface ScreenProps {
  role: Role;
  locale: Locale;
  scenario: Scenario;
  screen: Screen;
  storeIndex: number;
  attendance: AttendanceState;
  gpsSharing: boolean;
  applied: boolean;
  hired: boolean;
  published: boolean;
  assigned: string[];
  navigate: Dispatch<SetStateAction<Screen>>;
  setAttendance: Dispatch<SetStateAction<AttendanceState>>;
  setGpsSharing: Dispatch<SetStateAction<boolean>>;
  setApplied: Dispatch<SetStateAction<boolean>>;
  setHired: Dispatch<SetStateAction<boolean>>;
  setPublished: Dispatch<SetStateAction<boolean>>;
  setAssigned: Dispatch<SetStateAction<string[]>>;
  openModal: Dispatch<SetStateAction<ModalState>>;
}

type SharedProps = Pick<ScreenProps, 'locale' | 'navigate'>;

function PageTitle({
  title,
  subtitle,
  onBack,
  action,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-title">
      {onBack && <button className="back-button" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>}
      <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
      {action && <div className="page-title-action">{action}</div>}
    </div>
  );
}

function Avatar({ name, color = '#2c7b73', small = false }: { name: string; color?: string; small?: boolean }) {
  const initials = name.includes(' ') ? name.split(' ').map((part) => part[0]).slice(0, 2).join('') : name.slice(0, 2);
  return <span className={small ? 'avatar avatar--small' : 'avatar'} style={{ backgroundColor: color }}>{initials}</span>;
}

function SectionHead({ title, action }: { title: string; action?: string }) {
  return <div className="section-head"><h3>{title}</h3>{action && <button>{action} <ChevronRight size={14} /></button>}</div>;
}

function StatusPill({ tone, children }: { tone: 'mint' | 'orange' | 'red' | 'gray' | 'purple'; children: React.ReactNode }) {
  return <span className={`status-pill status-pill--${tone}`}>{children}</span>;
}

function OwnerHome({ locale, role, navigate }: SharedProps & { role: Role }) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const name = role === 'OWNER' ? tx('石井さん', 'Kaito') : tx('山田さん', 'Hana');
  return (
    <div className="screen owner-home">
      <div className="greeting-row">
        <div><p className="overline">MONDAY · OCT 12</p><h2>{tx(`こんにちは、${name}`, `Hi, ${name}`)}</h2></div>
        <Avatar name={name} color={role === 'OWNER' ? '#123f43' : '#ef8c62'} />
      </div>

      <section className="action-hero">
        <div className="hero-label"><CalendarCheck2 size={16} /><span>{tx('11月のシフト', 'NOVEMBER SCHEDULE')}</span></div>
        <h3>{tx('公開まで、あと2ステップ', 'Two steps until you’re ready')}</h3>
        <div className="workflow-steps">
          <button className="workflow-step complete" onClick={() => navigate('collection')}>
            <span className="step-index"><Check size={14} /></span><span><small>{tx('希望を集める', 'Collect')}</small><strong>8 / 12</strong></span>
          </button>
          <span className="workflow-line complete" />
          <button className="workflow-step active" onClick={() => navigate('builder')}>
            <span className="step-index">2</span><span><small>{tx('シフトを組む', 'Build')}</small><strong>{tx('3枠不足', '3 gaps')}</strong></span>
          </button>
          <span className="workflow-line" />
          <button className="workflow-step" onClick={() => navigate('publish')}>
            <span className="step-index">3</span><span><small>{tx('公開する', 'Publish')}</small><strong>{tx('未公開', 'Draft')}</strong></span>
          </button>
        </div>
        <button className="hero-cta" onClick={() => navigate('builder')}>{tx('シフト作成を続ける', 'Continue building')}<ArrowRight size={17} /></button>
      </section>

      <SectionHead title={tx('今日のチーム', 'Today’s team')} action={tx('勤怠を見る', 'View attendance')} />
      <button className="team-summary card-button" onClick={() => navigate('teamAttendance')}>
        <span><i className="dot dot--green" /><strong>4</strong><small>{tx('勤務中', 'Working')}</small></span>
        <span><i className="dot dot--orange" /><strong>1</strong><small>{tx('休憩中', 'On break')}</small></span>
        <span><i className="dot dot--gray" /><strong>2</strong><small>{tx('未出勤', 'Not in')}</small></span>
      </button>

      <SectionHead title={tx('対応が必要です', 'Needs attention')} />
      <button className="urgent-card card-button" onClick={() => navigate('openShifts')}>
        <span className="urgent-icon"><AlertTriangle size={19} /></span>
        <span className="urgent-copy"><small>{tx('急募 · あと1名', 'URGENT · 1 PERSON NEEDED')}</small><strong>{tx('本日 18:00〜22:00', 'Today, 18:00–22:00')}</strong><em>{tx('ディナーのホール担当', 'Dinner floor coverage')}</em></span>
        <ChevronRight size={18} />
      </button>

      <div className="insight-card">
        <span className="insight-icon"><Sparkles size={18} /></span>
        <div><strong>{tx('今週は順調です', 'This week looks healthy')}</strong><p>{tx('予定時間の92%が充足しています。', '92% of scheduled hours are covered.')}</p></div>
      </div>
    </div>
  );
}

function MemberHome({ locale, navigate }: SharedProps) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  return (
    <div className="screen member-home">
      <div className="greeting-row member-greeting"><div><p className="overline">MONDAY · OCT 12</p><h2>{tx('こんにちは、田中さん', 'Hi, Taro')}</h2></div><Avatar name={tx('田中 太郎', 'Taro Tanaka')} /></div>
      <section className="today-shift-card">
        <div className="shift-card-top"><span><i className="live-dot" />{tx('今日の勤務', 'TODAY’S SHIFT')}</span><StatusPill tone="mint">{tx('あと20分', 'IN 20 MIN')}</StatusPill></div>
        <div className="shift-time"><strong>18:00</strong><span><i /><small>5h</small></span><strong>23:00</strong></div>
        <div className="shift-location"><MapPin size={16} /><span>{tx('渋谷店 · ホール', 'Shibuya · Floor')}</span></div>
        <button className="white-button" onClick={() => navigate('attendance')}><Clock3 size={17} />{tx('出勤画面を開く', 'Open time clock')}</button>
      </section>
      <SectionHead title={tx('次の勤務', 'Up next')} action={tx('すべて見る', 'See all')} />
      <div className="upcoming-list">
        <button onClick={() => navigate('schedule')}><span className="date-tile"><small>OCT</small><strong>15</strong></span><span><strong>18:00 — 22:00</strong><small>{tx('渋谷店 · ホール', 'Shibuya · Floor')}</small></span><ChevronRight size={17} /></button>
        <button onClick={() => navigate('schedule')}><span className="date-tile"><small>OCT</small><strong>18</strong></span><span><strong>12:00 — 18:00</strong><small>{tx('渋谷店 · キッチン', 'Shibuya · Kitchen')}</small></span><ChevronRight size={17} /></button>
      </div>
      <SectionHead title={tx('募集中のシフト', 'Open shifts')} />
      <button className="open-shift-teaser" onClick={() => navigate('openShifts')}>
        <span className="briefcase-icon"><BriefcaseBusiness size={20} /></span><span><small>{tx('急募 · あと1名', 'URGENT · 1 SPOT')}</small><strong>{tx('10月20日 · 18:00〜22:00', 'Oct 20 · 18:00–22:00')}</strong></span><ChevronRight size={18} />
      </button>
    </div>
  );
}

function CollectionScreen({ locale, navigate, openModal }: SharedProps & Pick<ScreenProps, 'openModal'>) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const staff = [
    [tx('田中 太郎', 'Taro Tanaka'), true, '2h'],
    [tx('山田 花子', 'Hana Yamada'), true, '4h'],
    [tx('高橋 健', 'Ken Takahashi'), true, '1d'],
    [tx('鈴木 一郎', 'Ichiro Suzuki'), false, ''],
    [tx('佐藤 美咲', 'Misaki Sato'), false, ''],
  ] as const;
  return (
    <div className="screen">
      <PageTitle title={tx('希望を集める', 'Collect availability')} subtitle={tx('11月シフト · 期限 10月20日', 'November · Due Oct 20')} onBack={() => navigate('home')} />
      <section className="collection-progress">
        <div className="progress-ring"><strong>8</strong><span>/ 12</span></div>
        <div><small>{tx('提出状況', 'RESPONSES')}</small><h3>{tx('あと4人です', '4 people to go')}</h3><p>{tx('締切まであと8日', '8 days left')}</p></div>
      </section>
      <div className="action-pair">
        <button className="secondary-button" onClick={() => openModal({ type: 'qr' })}><QrCode size={18} />{tx('回答用QR', 'QR code')}</button>
        <button className="primary-button" onClick={() => openModal({ type: 'success', title: tx('通知しました', 'Reminder sent'), body: tx('未提出の4名に通知を送りました。', 'A reminder was sent to 4 people.') })}><BellRing size={18} />{tx('未提出者に通知', 'Send reminder')}</button>
      </div>
      <SectionHead title={tx('スタッフ', 'Staff')} action={tx('12人', '12 people')} />
      <div className="people-list">
        {staff.map(([name, done, time], index) => (
          <div key={name} className="person-row">
            <Avatar name={name} color={people[index]?.color} small />
            <span><strong>{name}</strong><small>{done ? tx(`${time}前に提出`, `Submitted ${time} ago`) : tx('まだ提出していません', 'Not submitted yet')}</small></span>
            {done ? <span className="round-check"><Check size={14} /></span> : <StatusPill tone="gray">{tx('未提出', 'PENDING')}</StatusPill>}
          </div>
        ))}
      </div>
      <button className="wide-ghost-button" onClick={() => navigate('availability')}><Globe2 size={17} />{tx('登録不要の回答画面を確認', 'Preview no-sign-up form')}</button>
    </div>
  );
}

function AvailabilityScreen({ locale, navigate, openModal }: SharedProps & Pick<ScreenProps, 'openModal'>) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const [step, setStep] = useState(1);
  const [choices, setChoices] = useState<Record<number, string>>({ 0: 'preferred', 1: 'available', 2: 'unavailable' });
  const days = locale === 'ja' ? [['11/1', '土'], ['11/2', '日'], ['11/3', '月']] : [['Nov 1', 'Sat'], ['Nov 2', 'Sun'], ['Nov 3', 'Mon']];
  return (
    <div className="screen public-form-screen">
      <PageTitle title={tx('11月シフト希望', 'November availability')} subtitle={`${stores[locale][0]} · ${tx('登録は不要です', 'No account required')}`} onBack={() => navigate('collection')} />
      <div className="form-stepper"><i className="done" /><span /><i className={step === 2 ? 'done' : ''} /><em>{step} / 2</em></div>
      {step === 1 ? (
        <section className="identity-panel">
          <span className="privacy-icon"><LockKeyhole size={20} /></span>
          <h3>{tx('あなたを確認します', 'Let’s confirm it’s you')}</h3>
          <p>{tx('管理者から案内された名前とPINを入力してください。', 'Use the name and PIN shared by your manager.')}</p>
          <label>{tx('あなたの名前', 'Your name')}<select defaultValue="taro"><option value="taro">{tx('田中 太郎', 'Taro Tanaka')}</option><option>{tx('佐藤 美咲', 'Misaki Sato')}</option></select></label>
          <label>PIN<input inputMode="numeric" defaultValue="••••" aria-label="PIN" /></label>
          <button className="primary-button" onClick={() => setStep(2)}>{tx('次へ', 'Continue')}<ArrowRight size={17} /></button>
          <small><ShieldCheck size={14} />{tx('この情報は本人確認にのみ使用されます', 'Used only to verify your identity')}</small>
        </section>
      ) : (
        <>
          <div className="availability-legend"><span><i className="preferred" />{tx('希望', 'Prefer')}</span><span><i className="available" />{tx('勤務可能', 'Available')}</span><span><i className="unavailable" />{tx('不可', 'Can’t work')}</span></div>
          <div className="availability-days">
            {days.map(([date, weekday], index) => {
              const choice = choices[index] ?? 'available';
              return (
                <article key={date} className="availability-day">
                  <div className="day-heading"><span><strong>{date}</strong><small>{weekday}</small></span>{choice !== 'unavailable' && <StatusPill tone={choice === 'preferred' ? 'mint' : 'purple'}>{choice === 'preferred' ? tx('希望', 'PREFER') : tx('勤務可能', 'AVAILABLE')}</StatusPill>}</div>
                  <div className="choice-row">
                    {[['preferred', '○', tx('希望', 'Prefer')], ['available', '△', tx('勤務可能', 'Available')], ['unavailable', '×', tx('不可', 'Can’t')]].map(([value, mark, label]) => <button key={value} className={choice === value ? `selected ${value}` : ''} onClick={() => setChoices((current) => ({ ...current, [index]: value }))}><b>{mark}</b><span>{label}</span></button>)}
                  </div>
                  {choice !== 'unavailable' && <div className="time-inputs"><label>{tx('開始', 'From')}<input type="time" defaultValue={index === 0 ? '18:00' : '12:00'} /></label><Minus size={16} /><label>{tx('終了', 'To')}<input type="time" defaultValue={index === 0 ? '23:00' : '18:00'} /></label></div>}
                </article>
              );
            })}
          </div>
          <button className="primary-button sticky-action" onClick={() => openModal({ type: 'success', title: tx('希望を提出しました', 'Availability submitted'), body: tx('提出内容は締切まで何度でも更新できます。', 'You can update your response until the deadline.') })}><Send size={17} />{tx('この内容で提出', 'Submit availability')}</button>
        </>
      )}
    </div>
  );
}

function BuilderScreen({ locale, navigate, assigned, setAssigned }: SharedProps & Pick<ScreenProps, 'assigned' | 'setAssigned'>) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const [date, setDate] = useState(2);
  const dates = locale === 'ja' ? [['8', '土'], ['9', '日'], ['10', '月'], ['11', '火'], ['12', '水']] : [['8', 'Sat'], ['9', 'Sun'], ['10', 'Mon'], ['11', 'Tue'], ['12', 'Wed']];
  const candidates = [
    { id: '田中 太郎', name: tx('田中 太郎', 'Taro Tanaka'), availability: tx('希望', 'Preferred'), time: '18:00–22:00', tone: 'mint' as const },
    { id: '山田 花子', name: tx('山田 花子', 'Hana Yamada'), availability: tx('勤務可能', 'Available'), time: '15:00–23:00', tone: 'purple' as const },
    { id: '佐藤 美咲', name: tx('佐藤 美咲', 'Misaki Sato'), availability: tx('勤務可能', 'Available'), time: '18:00–23:00', tone: 'purple' as const },
  ];
  const assignedCount = assigned.length;
  return (
    <div className="screen builder-screen">
      <PageTitle title={tx('シフトを組む', 'Build schedule')} subtitle={tx('11月 · 下書き', 'November · Draft')} onBack={() => navigate('home')} action={<button className="text-button" onClick={() => navigate('publish')}>{tx('確認', 'Review')}</button>} />
      <div className="date-strip">
        {dates.map(([day, weekday], index) => <button key={day} className={date === index ? 'active' : ''} onClick={() => setDate(index)}><small>{weekday}</small><strong>{day}</strong>{index === 2 && <i />}</button>)}
      </div>
      <section className="coverage-card">
        <div className="coverage-title"><span><small>{tx('必要人数', 'COVERAGE')}</small><strong>{date === 2 ? tx('11月10日（月）', 'Monday, Nov 10') : tx(`11月${dates[date][0]}日`, `November ${dates[date][0]}`)}</strong></span><StatusPill tone={assignedCount > 2 ? 'mint' : 'red'}>{assignedCount > 2 ? tx('充足', 'COVERED') : `-${Math.max(1, 3 - assignedCount)}`}</StatusPill></div>
        {[['12–15', 4, 4], ['15–18', 3, 3], ['18–22', 5, Math.min(5, 2 + assignedCount)]].map(([time, need, current]) => <div className="coverage-row" key={time}><span>{time}</span><div className="coverage-track"><i style={{ width: `${(Number(current) / Number(need)) * 100}%` }} className={Number(current) < Number(need) ? 'short' : ''} /></div><b>{current}/{need}</b></div>)}
        <div className="shortage-callout"><AlertTriangle size={16} /><span><strong>18:00–19:00</strong>{tx(` あと${Math.max(1, 3 - assignedCount)}人必要です`, ` needs ${Math.max(1, 3 - assignedCount)} more`)}</span></div>
      </section>
      <SectionHead title={tx('スタッフ候補', 'Available staff')} action={tx('希望順', 'By preference')} />
      <div className="candidate-list">
        {candidates.map((person, index) => {
          const isAssigned = assigned.includes(person.id);
          return <article key={person.id} className={isAssigned ? 'candidate assigned' : 'candidate'}><div className="candidate-main"><Avatar name={person.name} color={people[index].color} small /><span><strong>{person.name}</strong><small>{person.time}</small></span><StatusPill tone={person.tone}>{person.availability}</StatusPill></div>{isAssigned ? <button className="assigned-button" onClick={() => setAssigned((current) => current.filter((id) => id !== person.id))}><Check size={15} />{tx('割当済み', 'Assigned')}</button> : <button className="assign-button" onClick={() => setAssigned((current) => [...current, person.id])}><Plus size={15} />{tx('この時間で割り当て', 'Assign this shift')}</button>}</article>;
        })}
      </div>
      <button className="primary-button sticky-action" onClick={() => navigate('publish')}>{tx('公開前の確認へ', 'Review schedule')}<ArrowRight size={17} /></button>
    </div>
  );
}

function PublishScreen({ locale, navigate, published, setPublished, openModal }: SharedProps & Pick<ScreenProps, 'published' | 'setPublished' | 'openModal'>) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  if (published) return <div className="screen published-screen"><span className="published-orb"><Check size={38} /></span><small>{tx('11月シフト', 'NOVEMBER SCHEDULE')}</small><h2>{tx('公開しました！', 'Schedule published!')}</h2><p>{tx('12人のスタッフへ通知を送りました。変更があれば、いつでも更新できます。', 'All 12 staff members have been notified. You can update it anytime.')}</p><div className="published-summary"><span><CalendarCheck2 size={20} /><strong>142h</strong><small>{tx('総勤務時間', 'scheduled')}</small></span><span><UsersRound size={20} /><strong>12</strong><small>{tx('スタッフ', 'staff')}</small></span></div><button className="primary-button" onClick={() => navigate('home')}>{tx('ホームへ戻る', 'Back to home')}</button></div>;
  return (
    <div className="screen publish-screen">
      <PageTitle title={tx('公開前の確認', 'Review & publish')} subtitle={tx('11月シフト', 'November schedule')} onBack={() => navigate('builder')} />
      <section className="readiness-card"><div className="readiness-score"><strong>92</strong><small>%</small></div><div><small>{tx('シフト完成度', 'SCHEDULE HEALTH')}</small><h3>{tx('ほぼ準備完了です', 'Almost ready')}</h3><p>{tx('1件の人員不足があります', '1 coverage gap remains')}</p></div></section>
      <div className="review-list">
        <div><span className="review-icon good"><Check size={16} /></span><span><strong>{tx('12人を割り当て済み', '12 staff assigned')}</strong><small>{tx('全員の希望を確認済み', 'All availability reviewed')}</small></span><ChevronRight size={17} /></div>
        <div><span className="review-icon warn"><AlertTriangle size={16} /></span><span><strong>{tx('人員不足 1件', '1 coverage gap')}</strong><small>{tx('11/10 18:00〜19:00 · -1', 'Nov 10, 18:00–19:00 · -1')}</small></span><ChevronRight size={17} /></div>
      </div>
      <button className="preview-button" onClick={() => openModal({ type: 'shiftPreview' })}><Smartphone size={18} /><span><strong>{tx('スタッフ表示をプレビュー', 'Preview staff view')}</strong><small>{tx('公開後の見え方を確認', 'See what the team will see')}</small></span><ChevronRight size={18} /></button>
      <section className="publish-notice"><BellRing size={19} /><p><strong>{tx('公開すると通知されます', 'Publishing sends a notification')}</strong><br />{tx('スタッフ全員に最新のシフトをお知らせします。', 'Everyone will receive the latest schedule.')}</p></section>
      <button className="primary-button publish-button" onClick={() => setPublished(true)}><Send size={18} />{tx('シフトを公開する', 'Publish schedule')}</button>
      <button className="link-button" onClick={() => navigate('builder')}>{tx('下書きに戻る', 'Return to draft')}</button>
    </div>
  );
}

function MySchedule({ locale, navigate }: SharedProps) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const dates = [['12', true], ['13', false], ['14', false], ['15', true], ['16', false], ['17', false], ['18', true]] as const;
  return (
    <div className="screen schedule-screen">
      <PageTitle title={tx('マイシフト', 'My schedule')} subtitle={tx('2026年10月', 'October 2026')} />
      <div className="week-calendar">{dates.map(([day, hasShift], index) => <span key={day} className={index === 0 ? 'today' : ''}><small>{locale === 'ja' ? ['月','火','水','木','金','土','日'][index] : ['M','T','W','T','F','S','S'][index]}</small><strong>{day}</strong>{hasShift && <i />}</span>)}</div>
      <div className="month-summary"><span><CalendarCheck2 size={18} /><b>8</b><small>{tx('勤務日', 'shifts')}</small></span><span><Clock3 size={18} /><b>38h</b><small>{tx('予定時間', 'scheduled')}</small></span></div>
      <SectionHead title={tx('今後の勤務', 'Upcoming')} />
      <div className="shift-list">
        {[[tx('今日', 'Today'),'10/12','18:00 — 23:00',tx('ホール', 'Floor')],[tx('木曜日', 'Thursday'),'10/15','18:00 — 22:00',tx('ホール', 'Floor')],[tx('日曜日', 'Sunday'),'10/18','12:00 — 18:00',tx('キッチン', 'Kitchen')]].map(([label,date,time,area], index) => <button key={date} className={index === 0 ? 'featured' : ''} onClick={() => index === 0 && navigate('attendance')}><span className="shift-date"><small>{label}</small><strong>{date}</strong></span><span className="shift-detail"><strong>{time}</strong><small><MapPin size={13} />{stores[locale][0]} · {area}</small></span><ChevronRight size={17} /></button>)}
      </div>
    </div>
  );
}

function AttendanceScreen({ locale, attendance, setAttendance, navigate }: SharedProps & Pick<ScreenProps, 'attendance' | 'setAttendance'>) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const config = {
    before: { eyebrow: tx('まもなく勤務です', 'SHIFT STARTING SOON'), title: tx('本日の勤務', 'Today’s shift'), time: '17:58', sub: '18:00 — 23:00' },
    working: { eyebrow: tx('勤務中', 'CLOCKED IN'), title: tx('おつかれさまです', 'You’re on the clock'), time: '01:24', sub: tx('勤務時間', 'Time worked') },
    break: { eyebrow: tx('休憩中', 'ON BREAK'), title: tx('ゆっくり休んでください', 'Enjoy your break'), time: '00:18', sub: tx('12:03から', 'Since 12:03') },
    complete: { eyebrow: tx('勤務完了', 'SHIFT COMPLETE'), title: tx('今日もおつかれさまでした', 'Great work today'), time: '4:32', sub: tx('実勤務時間', 'Time worked') },
  }[attendance];
  return (
    <div className={`screen attendance-screen attendance-screen--${attendance}`}>
      <PageTitle title={tx('勤怠', 'Time clock')} subtitle={stores[locale][0]} />
      <section className="clock-panel">
        <span className="clock-state"><i />{config.eyebrow}</span>
        <h3>{config.title}</h3>
        <div className="time-orb"><span>{config.sub}</span><strong>{config.time}</strong>{attendance === 'before' && <small>JST</small>}</div>
        {attendance === 'before' && <div className="scheduled-shift"><CalendarDays size={17} /><span><small>{tx('予定', 'SCHEDULED')}</small><strong>{config.sub}</strong></span></div>}
        {attendance === 'working' && <div className="clocked-at"><span><small>{tx('出勤', 'CLOCKED IN')}</small><strong>18:02</strong></span><span><small>{tx('予定退勤', 'ENDS AT')}</small><strong>23:00</strong></span></div>}
        {attendance === 'break' && <p className="break-note">{tx('休憩時間は勤務時間から自動で差し引かれます。', 'Break time is automatically excluded from worked time.')}</p>}
        {attendance === 'complete' && <div className="completed-detail"><span><small>{tx('出退勤', 'SHIFT')}</small><strong>18:02 — 23:04</strong></span><span><small>{tx('休憩', 'BREAK')}</small><strong>30 min</strong></span></div>}
      </section>
      {attendance === 'before' && <button className="clock-action" onClick={() => setAttendance('working')}><span className="clock-action-icon"><Clock3 size={24} /></span><span><strong>{tx('出勤する', 'Clock in')}</strong><small>{tx('タップして勤務を開始', 'Tap to start your shift')}</small></span></button>}
      {attendance === 'working' && <div className="clock-actions"><button onClick={() => setAttendance('break')}><Coffee size={21} /><span><strong>{tx('休憩開始', 'Start break')}</strong><small>{tx('一時停止', 'Pause timer')}</small></span></button><button className="danger-action" onClick={() => setAttendance('complete')}><CheckCircle2 size={21} /><span><strong>{tx('退勤する', 'Clock out')}</strong><small>{tx('勤務を終了', 'End shift')}</small></span></button></div>}
      {attendance === 'break' && <button className="clock-action break-end" onClick={() => setAttendance('working')}><span className="clock-action-icon"><TimerReset size={24} /></span><span><strong>{tx('休憩を終了', 'End break')}</strong><small>{tx('勤務を再開します', 'Resume your shift')}</small></span></button>}
      {attendance === 'complete' && <><div className="completion-check"><BadgeCheck size={19} />{tx('勤務記録を保存しました', 'Timesheet saved')}</div><button className="wide-ghost-button" onClick={() => navigate('payroll')}><ReceiptText size={17} />{tx('勤怠履歴・給与概算を見る', 'View history & pay estimate')}</button></>}
      <div className="location-assurance"><LocateFixed size={16} /><span><strong>{tx('位置情報は共有されていません', 'Location sharing is off')}</strong><small>{tx('共有は「その他」から自分で開始できます', 'Only you can turn it on from More')}</small></span></div>
    </div>
  );
}

function TeamAttendance({ locale, navigate }: SharedProps) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const rows = [[tx('田中 太郎', 'Taro Tanaka'), tx('勤務中', 'Working'), '18:02〜', 'green'],[tx('山田 花子', 'Hana Yamada'), tx('休憩中', 'On break'), '12:03〜', 'orange'],[tx('鈴木 一郎', 'Ichiro Suzuki'), tx('退勤済', 'Done'), '09:58–17:01', 'purple'],[tx('佐藤 美咲', 'Misaki Sato'), tx('未出勤', 'Not in'), '18:00予定', 'gray']] as const;
  return (
    <div className="screen team-attendance-screen">
      <PageTitle title={tx('今日の勤怠', 'Today’s attendance')} subtitle={`${stores[locale][0]} · ${tx('10月12日', 'October 12')}`} action={<button className="icon-chip" onClick={() => navigate('gps')}><MapPinned size={18} /></button>} />
      <div className="attendance-stats"><span className="active"><strong>4</strong><small>{tx('勤務中', 'Working')}</small></span><span><strong>1</strong><small>{tx('休憩中', 'Break')}</small></span><span><strong>3</strong><small>{tx('退勤済', 'Done')}</small></span><span><strong>2</strong><small>{tx('未出勤', 'Not in')}</small></span></div>
      <div className="request-banner"><span><FilePenLine size={18} /></span><div><strong>{tx('修正申請が1件あります', '1 correction request')}</strong><small>{tx('確認して承認してください', 'Review and approve')}</small></div><ChevronRight size={17} /></div>
      <SectionHead title={tx('スタッフ', 'Staff on today')} action={tx('10人', '10 people')} />
      <div className="attendance-people">
        {rows.map(([name,status,time,tone], index) => <button key={name}><div className="avatar-with-status"><Avatar name={name} color={people[index]?.color} small /><i className={`presence presence--${tone}`} /></div><span><strong>{name}</strong><small>{time}</small></span><StatusPill tone={tone === 'green' ? 'mint' : tone === 'orange' ? 'orange' : tone === 'purple' ? 'purple' : 'gray'}>{status}</StatusPill></button>)}
      </div>
      <button className="wide-ghost-button" onClick={() => navigate('kiosk')}><Smartphone size={17} />{tx('共用端末モードを確認', 'Preview kiosk mode')}</button>
    </div>
  );
}

function OpenShifts({ locale, role, applied, setApplied, hired, setHired, navigate, openModal }: SharedProps & Pick<ScreenProps, 'role' | 'applied' | 'setApplied' | 'hired' | 'setHired' | 'openModal'>) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const isMember = role === 'MEMBER';
  if (!isMember) return (
    <div className="screen">
      <PageTitle title={tx('欠員募集', 'Open shift')} subtitle={tx('応募状況', 'Applications')} onBack={() => navigate('home')} />
      <section className="vacancy-header"><div><StatusPill tone={hired ? 'mint' : 'red'}>{hired ? tx('募集完了', 'FILLED') : tx('急募', 'URGENT')}</StatusPill><h3>{tx('10月20日（月）', 'Monday, October 20')}</h3><strong>18:00 — 22:00</strong><p><MapPin size={15} />{stores[locale][0]} · {tx('ホール', 'Floor')}</p></div><span><small>{tx('募集', 'NEEDED')}</small><strong>{hired ? 0 : 1}</strong><em>{tx('人', 'person')}</em></span></section>
      <SectionHead title={tx('応募したスタッフ', 'Applicants')} action={hired ? tx('採用済み', 'Filled') : tx('3人', '3 people')} />
      <div className="applicant-list">
        {[tx('田中 太郎', 'Taro Tanaka'),tx('山田 花子', 'Hana Yamada'),tx('鈴木 一郎', 'Ichiro Suzuki')].map((name,index) => <div key={name}><Avatar name={name} color={people[index].color} small /><span><strong>{name}</strong><small>{tx('応募済み · 2時間前', 'Applied · 2h ago')}</small></span>{hired && index === 0 ? <StatusPill tone="mint">{tx('採用', 'HIRED')}</StatusPill> : <button disabled={hired} onClick={() => { setHired(true); openModal({ type: 'success', title: tx('採用しました', 'Shift filled'), body: tx(`${name}さんのシフトに追加しました。`, `${name} was added to the schedule.`) }); }}>{tx('採用', 'Hire')}</button>}</div>)}
      </div>
      {hired && <div className="filled-banner"><CheckCircle2 size={20} /><span><strong>{tx('募集完了', 'Position filled')}</strong><small>{tx('田中 太郎さんを採用しました', 'Taro Tanaka was selected')}</small></span></div>}
    </div>
  );
  return (
    <div className="screen open-shifts-screen">
      <PageTitle title={tx('募集中のシフト', 'Open shifts')} subtitle={tx('あなたに合う勤務を見つける', 'Pick up an extra shift')} />
      {hired ? <section className="hired-celebration"><span>🎉</span><small>{tx('採用されました', 'YOU’RE IN')}</small><h2>{tx('シフトに追加されました', 'Added to your schedule')}</h2><p>{tx('10月20日 18:00〜22:00 · 渋谷店', 'Oct 20, 18:00–22:00 · Shibuya')}</p><button className="white-button" onClick={() => navigate('schedule')}>{tx('マイシフトで確認', 'View my schedule')}<ArrowRight size={17} /></button></section> : <><section className="open-shift-card"><div className="open-shift-banner"><StatusPill tone="red">{tx('急募', 'URGENT')}</StatusPill><span>{tx('あと1名', '1 SPOT LEFT')}</span></div><div className="open-date"><span><small>OCT</small><strong>20</strong></span><div><small>{tx('月曜日', 'MONDAY')}</small><h3>18:00 — 22:00</h3><p><MapPin size={15} />{stores[locale][0]} · {tx('ホール', 'Floor')}</p></div></div><div className="shift-perks"><span><Clock3 size={16} />4h</span><span><CircleDollarSign size={16} />¥5,200</span><span><UsersRound size={16} />{tx('3人と勤務', 'with 3 others')}</span></div><button className={applied ? 'cancel-application' : 'primary-button'} onClick={() => setApplied((current) => !current)}>{applied ? <><Check size={17} />{tx('応募済み · 取り消す', 'Applied · Cancel')}</> : <>{tx('勤務できます', 'I can work')}<ArrowRight size={17} /></>}</button></section>{applied && <div className="application-note"><CheckCircle2 size={18} /><span><strong>{tx('応募しました', 'Application sent')}</strong><small>{tx('管理者が確認すると通知されます', 'You’ll be notified when a manager responds')}</small></span></div>}</>}
      <SectionHead title={tx('今後の募集', 'More opportunities')} />
      <div className="quiet-empty"><BriefcaseBusiness size={25} /><p>{tx('ほかに募集中のシフトはありません。', 'There are no other open shifts right now.')}</p></div>
    </div>
  );
}

function GpsScreen({ locale, role, gpsSharing, setGpsSharing, navigate }: SharedProps & Pick<ScreenProps, 'role' | 'gpsSharing' | 'setGpsSharing'>) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  if (role !== 'MEMBER') return (
    <div className="screen gps-admin-screen">
      <PageTitle title={tx('位置情報', 'Live locations')} subtitle={tx('勤務中・共有中のみ', 'Only staff who opted in')} onBack={() => navigate('teamAttendance')} />
      <div className="mock-map">
        <span className="map-road road-a" /><span className="map-road road-b" /><span className="map-road road-c" /><span className="map-block block-a" /><span className="map-block block-b" /><span className="map-label label-a">Hachikō</span><span className="map-label label-b">Miyashita</span>
        <span className="map-store"><Store size={16} /></span>
        <span className="staff-pin pin-a"><Avatar name={tx('田中', 'Taro')} color="#2c7b73" small /><em>{tx('田中', 'Taro')}</em></span>
        <span className="staff-pin pin-b"><Avatar name={tx('山田', 'Hana')} color="#ef8c62" small /><em>{tx('山田', 'Hana')}</em></span>
        <span className="map-privacy"><ShieldCheck size={13} />{tx('本人が共有中', 'Opted in')}</span>
      </div>
      <SectionHead title={tx('共有中 2人', 'Sharing · 2')} action={tx('更新', 'Refresh')} />
      <div className="location-list"><div><Avatar name={tx('田中 太郎', 'Taro Tanaka')} small /><span><strong>{tx('田中 太郎', 'Taro Tanaka')}</strong><small>{tx('最終更新 1分前', 'Updated 1 min ago')}</small></span><i /></div><div><Avatar name={tx('山田 花子', 'Hana Yamada')} color="#ef8c62" small /><span><strong>{tx('山田 花子', 'Hana Yamada')}</strong><small>{tx('最終更新 3分前', 'Updated 3 min ago')}</small></span><i /></div></div>
      <p className="privacy-footnote"><LockKeyhole size={15} />{tx('共有をONにした勤務中スタッフだけが表示されます。管理者から開始することはできません。', 'Only clocked-in staff who choose to share appear here. Managers cannot turn sharing on.')}</p>
    </div>
  );
  return (
    <div className="screen gps-member-screen">
      <PageTitle title={tx('位置情報共有', 'Location sharing')} subtitle={tx('勤務中のみ利用できます', 'Available while clocked in')} onBack={() => navigate('settings')} />
      <section className={gpsSharing ? 'gps-control is-on' : 'gps-control'}>
        <div className="gps-orb"><Navigation size={34} /></div>
        <span className="gps-state"><i />{gpsSharing ? tx('位置情報共有中', 'SHARING LOCATION') : tx('現在 OFF', 'CURRENTLY OFF')}</span>
        <h3>{gpsSharing ? tx('渋谷店の管理者へ共有中', 'Sharing with Shibuya managers') : tx('共有するかは、あなた次第', 'You’re always in control')}</h3>
        <p>{gpsSharing ? tx('退勤すると位置共有は自動で停止します。', 'Sharing will stop automatically when you clock out.') : tx('位置情報はあなたがONにした時だけ、勤務先の管理者に共有されます。', 'Your location is shared with store managers only when you turn it on.')}</p>
        <button className={gpsSharing ? 'stop-sharing' : 'primary-button'} onClick={() => setGpsSharing((current) => !current)}>{gpsSharing ? tx('共有を停止', 'Stop sharing') : tx('位置共有を開始', 'Start sharing')}</button>
      </section>
      <div className="privacy-points"><div><UserPlus size={18} /><span><strong>{tx('自分で開始', 'You opt in')}</strong><small>{tx('管理者は勝手に開始できません', 'Managers cannot start it')}</small></span></div><div><ShieldCheck size={18} /><span><strong>{tx('管理者だけ閲覧', 'Managers only')}</strong><small>{tx('他のスタッフには表示されません', 'Never visible to coworkers')}</small></span></div><div><Clock3 size={18} /><span><strong>{tx('退勤で自動停止', 'Stops at clock-out')}</strong><small>{tx('勤務外は共有されません', 'Never shared off shift')}</small></span></div></div>
    </div>
  );
}

function StaffScreen({ locale, navigate }: SharedProps) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  return (
    <div className="screen staff-screen">
      <PageTitle title={tx('スタッフ', 'Staff')} subtitle={tx('12人 · 3店舗', '12 people · 3 stores')} action={<button className="add-round" onClick={() => navigate('staffDetail')}><Plus size={19} /></button>} />
      <div className="search-faux">⌕ <span>{tx('名前で検索', 'Search by name')}</span></div>
      <div className="filter-chips"><button className="active">{tx('すべて', 'All')} · 12</button><button>OWNER · 1</button><button>MANAGER · 2</button><button>MEMBER · 9</button></div>
      <div className="staff-list">
        {people.map((person) => <button key={person.ja} onClick={() => navigate('staffDetail')}><Avatar name={person[locale]} color={person.color} /><span><strong>{person[locale]}</strong><small>{stores[locale][person.store]} · {person.role}</small></span><span className="active-label"><i />{tx('在籍', 'Active')}</span><ChevronRight size={17} /></button>)}
      </div>
      <button className="primary-button"><UserPlus size={18} />{tx('スタッフを追加', 'Add staff member')}</button>
    </div>
  );
}

function StaffDetail({ locale, navigate }: SharedProps) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  return (
    <div className="screen detail-screen">
      <PageTitle title={tx('スタッフ詳細', 'Staff details')} onBack={() => navigate('staff')} action={<button className="text-button">{tx('編集', 'Edit')}</button>} />
      <div className="profile-hero"><Avatar name={tx('田中 太郎', 'Taro Tanaka')} /><h3>{tx('田中 太郎', 'Taro Tanaka')}</h3><p>MEMBER · {stores[locale][0]}</p><StatusPill tone="mint">{tx('在籍中', 'ACTIVE')}</StatusPill></div>
      <div className="detail-card"><label>{tx('時給', 'Hourly rate')}<strong>¥1,300</strong></label><label>{tx('電話番号', 'Phone')}<strong>090-1234-5678</strong></label><label>{tx('勤務開始日', 'Started')}<strong>2025 / 04 / 01</strong></label><label>{tx('スタッフPIN', 'Staff PIN')}<strong>••••</strong></label></div>
      <div className="detail-actions"><button><CalendarDays size={18} />{tx('シフトを見る', 'View schedule')}<ChevronRight size={17} /></button><button><Clock3 size={18} />{tx('勤怠履歴を見る', 'View attendance')}<ChevronRight size={17} /></button><button><WalletCards size={18} />{tx('給与概算を見る', 'View pay estimate')}<ChevronRight size={17} /></button></div>
    </div>
  );
}

function StoresScreen({ locale, navigate }: SharedProps) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  return <div className="screen stores-screen"><PageTitle title={tx('店舗', 'Stores')} subtitle={tx('3店舗 · 26人', '3 stores · 26 people')} onBack={() => navigate('settings')} /><div className="store-list">{stores[locale].map((store,index) => <button key={store}><span className={`store-illustration store-illustration--${index}`}><Store size={23} /></span><span><strong>{store}</strong><small>{[12,8,6][index]} {tx('人 · Asia/Tokyo', 'staff · Asia/Tokyo')}</small></span><ChevronRight size={18} /></button>)}</div><button className="primary-button"><Plus size={18} />{tx('店舗を追加', 'Add a store')}</button></div>;
}

function SubscriptionScreen({ locale, scenario, navigate }: SharedProps & Pick<ScreenProps, 'scenario'>) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const trial = scenario === 'trial';
  const paid = scenario === 'paid';
  return (
    <div className="screen subscription-screen">
      <PageTitle title={tx('プラン', 'Subscription')} subtitle="Crewami Plan" onBack={() => navigate('settings')} />
      {(trial || paid) && <section className="current-plan"><span className="plan-crown"><Crown size={22} /></span><small>{paid ? tx('現在のプラン', 'CURRENT PLAN') : tx('無料体験中', 'FREE TRIAL')}</small><h3>Crewami Standard</h3>{trial ? <div className="trial-days"><strong>23</strong><span>{tx('日', 'days')}<small>{tx('残り', 'remaining')}</small></span></div> : <StatusPill tone="mint">{tx('課金済み', 'ACTIVE')}</StatusPill>}<div className="seat-meter"><span><small>{tx('ユーザー', 'SEATS')}</small><strong>18 / 30</strong></span><i><b style={{ width: '60%' }} /></i></div></section>}
      {!trial && !paid && <section className="plan-intro"><span><Gift size={21} /></span><div><small>{tx('はじめの1か月', 'YOUR FIRST MONTH')}</small><h3>{tx('無料で、すべて試せます', 'Try everything free')}</h3><p>{tx('チームに合うかじっくり確認できます。', 'See how Crewami fits your team.')}</p></div></section>}
      {scenario === 'unpaid' && <section className="seat-limit-card"><AlertTriangle size={20} /><div><small>{tx('ユーザー上限', 'SEAT LIMIT')}</small><h3>30 / 30 users</h3><p>{tx('新しいスタッフを追加するには、プランを変更してください。', 'Change your plan to add another staff member.')}</p></div></section>}
      <SectionHead title={tx('プランを選ぶ', 'Choose a plan')} />
      <div className="plan-list"><button><span><small>SMALL</small><strong>10 users</strong></span><em>¥2,980<small>/mo</small></em></button><button className="recommended"><span className="recommend-label">{tx('おすすめ', 'RECOMMENDED')}</span><span><small>STANDARD</small><strong>30 users</strong></span><em>¥5,980<small>/mo</small></em><CheckCircle2 size={19} /></button><button><span><small>PRO</small><strong>100 users</strong></span><em>¥12,800<small>/mo</small></em></button></div>
      {!paid && <button className="primary-button"><CreditCard size={18} />{trial ? tx('Standardを続ける', 'Continue with Standard') : tx('1か月無料で始める', 'Start 1 month free')}</button>}
      <p className="prototype-price-note">{tx('※ 価格はUI確認用の仮設定です。', 'Prototype pricing shown for UI evaluation only.')}</p>
    </div>
  );
}

function PayrollScreen({ locale, navigate }: SharedProps) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  return (
    <div className="screen payroll-screen">
      <PageTitle title={tx('給与概算', 'Pay estimate')} subtitle={tx('2026年10月', 'October 2026')} onBack={() => navigate('settings')} />
      <section className="pay-hero"><small>{tx('今月の給与概算', 'ESTIMATED PAY')}</small><h2><span>¥</span>107,250</h2><p>{tx('10月1日〜10月31日', 'October 1–31')}</p></section>
      <div className="pay-stats"><span><small>{tx('勤務日数', 'DAYS WORKED')}</small><strong>18<em>{tx('日', ' days')}</em></strong></span><span><small>{tx('勤務時間', 'HOURS')}</small><strong>82<em>h</em> 30<em>m</em></strong></span></div>
      <div className="pay-breakdown"><div><span>{tx('時給', 'Hourly rate')}</span><strong>¥1,300</strong></div><div><span>{tx('通常勤務', 'Regular hours')}</span><strong>82h 30m</strong></div><div><span>{tx('概算合計', 'Estimated total')}</span><strong>¥107,250</strong></div></div>
      <div className="disclaimer"><HelpCircle size={18} /><p><strong>{tx('概算金額です', 'This is an estimate')}</strong><br />{tx('実際の給与明細・支給額とは異なる場合があります。', 'Actual payroll and your final payment may differ.')}</p></div>
      <SectionHead title={tx('勤怠履歴', 'Attendance history')} />
      <div className="history-list">{[['10/12','18:02 — 23:04','4h 32m'],['10/10','17:58 — 22:01','4h 03m'],['10/08','12:01 — 18:06','5h 35m']].map(([date,time,total]) => <button key={date} onClick={() => navigate('correction')}><span><strong>{date}</strong><small>{time} · {tx('休憩30分', '30m break')}</small></span><b>{total}</b><ChevronRight size={16} /></button>)}</div>
      <button className="wide-ghost-button" onClick={() => navigate('correction')}><FilePenLine size={17} />{tx('勤怠の修正を申請', 'Request a correction')}</button>
    </div>
  );
}

function CorrectionScreen({ locale, navigate, openModal }: SharedProps & Pick<ScreenProps, 'openModal'>) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  return (
    <div className="screen correction-screen">
      <PageTitle title={tx('勤怠の修正申請', 'Request a correction')} subtitle={tx('10月12日の勤務', 'Shift on October 12')} onBack={() => navigate('payroll')} />
      <section className="current-record"><small>{tx('現在の記録', 'CURRENT RECORD')}</small><div><span><em>{tx('出勤', 'CLOCK IN')}</em><strong>18:02</strong></span><ArrowRight size={16} /><span><em>{tx('退勤', 'CLOCK OUT')}</em><strong>23:04</strong></span></div><p>{tx('休憩 30分 · 実勤務 4時間32分', '30m break · 4h 32m worked')}</p></section>
      <SectionHead title={tx('修正後', 'Corrected time')} />
      <div className="correction-times"><label>{tx('出勤', 'Clock in')}<input type="time" defaultValue="18:00" /></label><Minus size={16} /><label>{tx('退勤', 'Clock out')}<input type="time" defaultValue="23:00" /></label></div>
      <label className="form-label">{tx('理由', 'Reason')}<textarea defaultValue={tx('打刻を忘れていました', 'I forgot to clock in on time.')} /></label>
      <div className="approval-note"><ShieldCheck size={18} /><span><strong>{tx('管理者の確認後に反映されます', 'A manager will review this')}</strong><small>{tx('申請内容は監査履歴に残ります。', 'The request will remain in the audit history.')}</small></span></div>
      <button className="primary-button" onClick={() => openModal({ type: 'success', title: tx('修正を申請しました', 'Correction requested'), body: tx('管理者の確認後に勤怠へ反映されます。', 'Your timesheet will update after manager approval.') })}><Send size={17} />{tx('修正を申請', 'Submit request')}</button>
    </div>
  );
}

function KioskScreen({ locale, navigate, openModal }: SharedProps & Pick<ScreenProps, 'openModal'>) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  return <div className="screen kiosk-screen"><PageTitle title={tx('共用端末モード', 'Shared time clock')} subtitle={tx('機能追加候補 · UIプレビュー', 'Feature preview')} onBack={() => navigate('teamAttendance')} /><section className="kiosk-card"><div className="kiosk-brand"><span className="kiosk-logo">C</span><strong>Crewami</strong></div><small>{stores[locale][0]}</small><h2>{tx('出退勤', 'Time clock')}</h2><label>{tx('名前を選択', 'Select your name')}<select defaultValue="taro"><option value="taro">{tx('田中 太郎', 'Taro Tanaka')}</option><option>{tx('山田 花子', 'Hana Yamada')}</option></select></label><label>PIN<input value="••••" readOnly /></label><button className="kiosk-clock-button" onClick={() => openModal({ type: 'success', title: tx('出勤しました', 'Clocked in'), body: tx('田中 太郎 · 18:02', 'Taro Tanaka · 18:02') })}><Clock3 size={22} />{tx('出勤', 'Clock in')}</button></section><p className="kiosk-note"><Sparkles size={15} />{tx('店舗のiPad等で使う将来機能のイメージです。', 'A concept for a shared iPad at the store.')}</p></div>;
}

function SettingsScreen({ locale, role, navigate }: SharedProps & Pick<ScreenProps, 'role'>) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const isOwner = role === 'OWNER';
  const isMember = role === 'MEMBER';
  const groups = [
    { label: tx('ワークスペース', 'WORKSPACE'), items: [
      ...(isOwner ? [[tx('店舗', 'Stores'), Building2, 'stores' as Screen], [tx('サブスクリプション', 'Subscription'), CreditCard, 'subscription' as Screen]] : []),
      ...(!isMember ? [[tx('位置情報マップ', 'Live locations'), MapPinned, 'gps' as Screen], [tx('共用端末モード', 'Shared time clock'), Smartphone, 'kiosk' as Screen]] : [[tx('給与概算・勤怠履歴', 'Pay estimate & history'), WalletCards, 'payroll' as Screen], [tx('位置情報共有', 'Location sharing'), Navigation, 'gps' as Screen]]),
    ]},
    { label: tx('設定', 'PREFERENCES'), items: [[tx('通知', 'Notifications'), BellRing, 'home' as Screen],[tx('言語', 'Language'), Languages, 'home' as Screen],[tx('プライバシー', 'Privacy'), ShieldCheck, 'home' as Screen]] },
    { label: tx('サポート', 'SUPPORT'), items: [[tx('フィードバック', 'Send feedback'), MessageCircleMore, 'feedback' as Screen],[tx('Crewamiを評価', 'Review Crewami'), Sparkles, 'home' as Screen],[tx('利用規約', 'Terms'), ReceiptText, 'home' as Screen]] },
  ];
  return (
    <div className="screen settings-screen">
      <PageTitle title={tx('その他', 'More')} />
      <div className="account-card"><Avatar name={role === 'OWNER' ? tx('石井 海斗', 'Kaito Ishii') : role === 'MANAGER' ? tx('山田 花子', 'Hana Yamada') : tx('田中 太郎', 'Taro Tanaka')} /><span><strong>{role === 'OWNER' ? tx('石井 海斗', 'Kaito Ishii') : role === 'MANAGER' ? tx('山田 花子', 'Hana Yamada') : tx('田中 太郎', 'Taro Tanaka')}</strong><small>{role} · {stores[locale][0]}</small></span><ChevronRight size={18} /></div>
      {groups.map((group) => <section className="settings-group" key={group.label}><small>{group.label}</small><div>{group.items.map(([label,Icon,target]) => <button key={label as string} onClick={() => navigate(target as Screen)}><span className="setting-icon"><Icon size={18} /></span><strong>{label as string}</strong>{label === tx('言語', 'Language') && <em>{locale === 'ja' ? '日本語' : 'English'}</em>}<ChevronRight size={17} /></button>)}</div></section>)}
      <button className="logout-button"><LogOut size={17} />{tx('ログアウト', 'Log out')}</button>
      <p className="version">Crewami Prototype · v0.1.0</p>
    </div>
  );
}

function FeedbackScreen({ locale, navigate, openModal }: SharedProps & Pick<ScreenProps, 'openModal'>) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const [category, setCategory] = useState('idea');
  return (
    <div className="screen feedback-screen">
      <PageTitle title={tx('フィードバック', 'Feedback')} onBack={() => navigate('settings')} />
      <div className="feedback-intro"><span><MessageCircleMore size={25} /></span><h3>{tx('Crewamiを一緒に育ててください', 'Help us shape Crewami')}</h3><p>{tx('気づいたことや、もっと便利になるアイデアをお聞かせください。', 'Tell us what worked, what didn’t, or what would make your day easier.')}</p></div>
      <label className="form-label">{tx('カテゴリ', 'Category')}<div className="feedback-categories">{[['bug',tx('不具合', 'Bug')],['idea',tx('改善要望', 'Idea')],['other',tx('その他', 'Other')]].map(([value,label]) => <button key={value} className={category === value ? 'active' : ''} onClick={() => setCategory(value)}>{category === value && <Check size={14} />}{label}</button>)}</div></label>
      <label className="form-label">{tx('メッセージ', 'Message')}<textarea placeholder={tx('どんなことでもお聞かせください…', 'Share your thoughts…')} defaultValue={tx('シフト作成画面がとても分かりやすいです。', 'The schedule builder feels very easy to understand.')} /></label>
      <label className="form-label">{tx('メールアドレス（任意）', 'Email (optional)')}<div className="input-with-icon"><Mail size={17} /><input type="email" placeholder="you@example.com" /></div></label>
      <button className="primary-button" onClick={() => openModal({ type: 'success', title: tx('送信しました', 'Thank you!'), body: tx('貴重なご意見をありがとうございます。', 'Your feedback helps make Crewami better.') })}><Send size={17} />{tx('フィードバックを送信', 'Send feedback')}</button>
    </div>
  );
}

export function PrototypeScreens(props: ScreenProps) {
  const { screen } = props;
  if (screen === 'home') return props.role === 'MEMBER' ? <MemberHome {...props} /> : <OwnerHome {...props} />;
  if (screen === 'collection') return <CollectionScreen {...props} />;
  if (screen === 'availability') return <AvailabilityScreen {...props} />;
  if (screen === 'builder') return <BuilderScreen {...props} />;
  if (screen === 'publish') return <PublishScreen {...props} />;
  if (screen === 'schedule') return <MySchedule {...props} />;
  if (screen === 'attendance') return <AttendanceScreen {...props} />;
  if (screen === 'teamAttendance') return <TeamAttendance {...props} />;
  if (screen === 'openShifts') return <OpenShifts {...props} />;
  if (screen === 'gps') return <GpsScreen {...props} />;
  if (screen === 'staff') return <StaffScreen {...props} />;
  if (screen === 'staffDetail') return <StaffDetail {...props} />;
  if (screen === 'stores') return <StoresScreen {...props} />;
  if (screen === 'subscription') return <SubscriptionScreen {...props} />;
  if (screen === 'payroll') return <PayrollScreen {...props} />;
  if (screen === 'correction') return <CorrectionScreen {...props} />;
  if (screen === 'kiosk') return <KioskScreen {...props} />;
  if (screen === 'feedback') return <FeedbackScreen {...props} />;
  return <SettingsScreen {...props} />;
}
