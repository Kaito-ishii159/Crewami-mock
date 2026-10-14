'use client';

import { useMemo, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, CreditCard, Download, FileSpreadsheet, LockKeyhole, Paperclip, Smartphone, Upload, WalletCards } from 'lucide-react';
import {
  allFeatures,
  calculateMonthlyPrice,
  featureLabels,
  translate,
  userLimitLabel,
  type AttendanceState,
  type FeatureFlags,
  type FeatureKey,
  type Locale,
  type Plan,
  type Role,
  type Screen,
  type StaffRecord,
  type SubscriptionStatus,
} from '@/lib/prototype';
import type { ModalState } from './CrewamiPrototype';

type Navigate = Dispatch<SetStateAction<Screen>>;

function PageTitle({ title, subtitle, back, action }: { title: string; subtitle?: string; back: () => void; action?: React.ReactNode }) {
  return <div className="page-title"><button className="back-button" onClick={back} aria-label="Back"><ArrowLeft /></button><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action && <div className="page-title-action">{action}</div>}</div>;
}

function money(value: number) { return `¥${value.toLocaleString('ja-JP')}`; }

export function FeatureSettingsScreen({ locale, navigate, entitlements, enabled, setEnabled, openModal }: { locale: Locale; navigate: Navigate; entitlements: FeatureFlags; enabled: FeatureFlags; setEnabled: Dispatch<SetStateAction<FeatureFlags>>; openModal: Dispatch<SetStateAction<ModalState>> }) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  function toggle(feature: FeatureKey) {
    if (!entitlements[feature]) return;
    if (feature === 'ESTIMATED_PAY' && !enabled.ATTENDANCE) {
      openModal({ type: 'notice', title: tx('勤怠管理が必要です', 'Attendance required'), body: tx('給与概算を使用するには、勤怠管理をONにしてください。', 'Turn on Attendance before enabling Estimated Pay.') });
      return;
    }
    if (feature === 'ATTENDANCE' && enabled.ATTENDANCE && enabled.ESTIMATED_PAY) {
      openModal({ type: 'confirm', title: tx('勤怠管理をOFFにしますか？', 'Turn off Attendance?'), body: tx('勤怠管理をOFFにすると給与概算もOFFになります。', 'Estimated Pay will also be turned off.'), onConfirm: () => setEnabled((current) => ({ ...current, ATTENDANCE: false, ESTIMATED_PAY: false })) });
      return;
    }
    setEnabled((current) => ({ ...current, [feature]: !current[feature] }));
  }
  return <div className="screen"><PageTitle title={tx('利用する機能', 'Features in use')} subtitle={tx('店舗で使用する機能を選択してください。', 'Choose the features your store uses.')} back={() => navigate('settings')} /><div className="feature-list">{allFeatures.map((feature) => <div className={!entitlements[feature] ? 'feature-row locked' : 'feature-row'} key={feature}><div><strong>{featureLabels[feature][locale]}</strong>{!entitlements[feature] && <small><LockKeyhole />{tx('全機能プランで利用できます', 'Available on the Full plan')}</small>}</div><button className={`switch ${enabled[feature] && entitlements[feature] ? 'on' : ''}`} disabled={!entitlements[feature]} onClick={() => toggle(feature)} aria-label={featureLabels[feature][locale]}><i /></button></div>)}</div><div className="form-note"><AlertTriangle /><p>{tx('OFFにした機能は管理者・メンバー両方のホーム、ナビゲーション、設定から非表示になります。', 'Disabled features disappear from home, navigation, and settings for both roles.')}</p></div></div>;
}

const collectionBenefits = ['シフト希望収集', 'CSV Export', 'Excel Export', 'カスタムシフト表連携依頼'];
const fullBenefits = ['シフト収集', 'シフト管理', '勤怠管理', '緊急募集', 'GPS', '給与概算', 'CSV / Excel'];

export function SubscriptionScreen({ locale, navigate, status, plan, activeUsers, onPurchase }: { locale: Locale; navigate: Navigate; status: SubscriptionStatus; plan: Plan | null; activeUsers: number; onPurchase: (plan: Plan) => void }) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const [selected, setSelected] = useState<Plan>(plan ?? 'FULL');
  const label = status === 'trial' ? tx('無料体験中', 'Free trial') : status === 'expired' ? tx('無料体験終了', 'Trial ended') : plan === 'COLLECTION' ? tx('シフト収集プラン', 'Collection plan') : tx('全機能プラン', 'Full plan');
  return <div className="screen"><PageTitle title={tx('プランとお支払い', 'Plan & billing')} back={() => navigate('settings')} /><section className="billing-status"><CreditCard /><div><small>{tx('現在', 'CURRENT')}</small><h3>{label}</h3>{status === 'trial' && <p>{tx('全機能利用可能 · 残り23日', 'All features · 23 days remaining')}</p>}{status === 'expired' && <p>{tx('プランを選ぶと業務機能を再開できます。', 'Choose a plan to resume work features.')}</p>}</div><span><strong>{activeUsers}</strong>{tx('人', ' users')}</span></section><div className="pricing-context"><span>{tx('料金区分', 'Billing tier')}</span><strong>{userLimitLabel(activeUsers)}{tx('名まで', ' users')}</strong><small>ceil({activeUsers} / 100) = {Math.ceil(activeUsers / 100)} blocks</small></div><div className="subscription-plans">{([['COLLECTION', tx('シフト収集プラン', 'Shift Collection Plan'), collectionBenefits], ['FULL', tx('全機能プラン', 'Full Plan'), fullBenefits]] as const).map(([item, name, benefits]) => <button key={item} className={selected === item ? 'subscription-plan selected' : 'subscription-plan'} onClick={() => setSelected(item)}><span className="plan-radio">{selected === item ? <Check /> : null}</span><div><h3>{name}</h3><p>{tx('100名まで', 'Up to 100 users')} · {item === 'COLLECTION' ? '¥500' : '¥4,980'} / {tx('月', 'month')}</p><strong>{tx(`現在${activeUsers}名の場合`, `For ${activeUsers} users`)} <b>{money(calculateMonthlyPrice(item, activeUsers))} / {tx('月', 'month')}</b></strong><ul>{benefits.map((benefit) => <li key={benefit}><Check />{benefit}</li>)}</ul></div></button>)}</div><button className="primary-button full-button" onClick={() => onPurchase(selected)}>{tx('このプランを選ぶ', 'Choose this plan')}</button><p className="prototype-price-note">{tx('モック購入です。実際の決済は発生しません。', 'Mock purchase only. No real charge occurs.')}</p></div>;
}

const exportRows = [
  ['田中 太郎', 'tanaka@example.com', '2026-11-01', '勤務可能', '09:00', '18:00'],
  ['山田 花子', 'yamada@example.com', '2026-11-01', '勤務不可', '', ''],
  ['佐藤 美咲', 'sato@example.com', '2026-11-02', '勤務可能', '12:00', '20:00'],
];

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export function ExportScreen({ locale, navigate, includeConfirmed }: { locale: Locale; navigate: Navigate; includeConfirmed: boolean }) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const headers = ['スタッフ名', 'メールアドレス', '日付', '希望種別', '開始時刻', '終了時刻'];
  const csv = [headers, ...exportRows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  const xmlRows = [headers, ...exportRows].map((row) => `<Row>${row.map((cell) => `<Cell><Data ss:Type="String">${cell}</Data></Cell>`).join('')}</Row>`).join('');
  const spreadsheet = `<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="11月希望"><Table>${xmlRows}</Table></Worksheet></Workbook>`;
  return <div className="screen"><PageTitle title={tx('データをダウンロード', 'Download data')} subtitle={tx('11月 シフト希望データ', 'November availability data')} back={() => navigate('collection')} /><div className="export-preview"><FileSpreadsheet /><div><strong>{tx('出力項目', 'Export fields')}</strong><p>{headers.join(' · ')}</p></div></div><div className="export-actions"><button onClick={() => download('crewami-availability-2026-11.csv', `\uFEFF${csv}`, 'text/csv;charset=utf-8')}><Download /><span><strong>CSV</strong><small>{tx('CSVをダウンロード', 'Download CSV')}</small></span></button><button onClick={() => download('crewami-availability-2026-11.xls', spreadsheet, 'application/vnd.ms-excel')}><Download /><span><strong>Excel</strong><small>{tx('Excelをダウンロード', 'Download Excel')}</small></span></button></div>{includeConfirmed && <div className="form-note"><Check /><p>{tx('全機能プランでは確定シフトデータも出力対象にできます。', 'The Full plan can also export confirmed shifts.')}</p></div>}<button className="custom-integration-card" onClick={() => navigate('customIntegration')}><Upload /><span><strong>{tx('今使っているシフト表へ連携したい', 'Connect my current shift sheet')}</strong><small>{tx('Excel・CSV形式に合わせた専用連携を作成できます', 'We can build an integration for your Excel or CSV format')}</small><b>{tx('個別見積もり', 'Custom quote')}</b></span><ChevronRight /></button></div>;
}

export type CustomOrderStatus = 'draft' | 'quoted' | 'accepted' | 'paid';

export function CustomIntegrationScreen({ locale, navigate, status, setStatus }: { locale: Locale; navigate: Navigate; status: CustomOrderStatus; setStatus: Dispatch<SetStateAction<CustomOrderStatus>> }) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const [format, setFormat] = useState('Excel'); const [file, setFile] = useState(''); const [request, setRequest] = useState('店舗別・スタッフ別に色分けしたい'); const [email, setEmail] = useState('admin@example.com');
  if (status !== 'draft') return <div className="screen"><PageTitle title={tx('専用シフト表連携', 'Custom shift integration')} back={() => navigate('export')} /><div className="order-status"><span><Check /></span><h3>{tx('見積もり依頼を受け付けました', 'Quote request received')}</h3><p>{tx('ステータス', 'Status')}</p><strong>{tx('見積作成中', 'Preparing quote')}</strong></div><button className="primary-button full-button" onClick={() => { setStatus('quoted'); navigate('customQuote'); }}>{tx('モック見積もりを確認', 'Preview mock quote')}</button></div>;
  return <div className="screen"><PageTitle title={tx('専用シフト表連携', 'Custom shift integration')} subtitle={tx('個別見積もり', 'Custom quote')} back={() => navigate('export')} /><form className="mock-form" onSubmit={(event) => { event.preventDefault(); setStatus('quoted'); }}><fieldset><legend>{tx('現在使っている形式', 'Current format')}</legend><div className="radio-options">{['Excel', 'CSV', tx('その他', 'Other')].map((item) => <button type="button" key={item} className={format === item ? 'selected' : ''} onClick={() => setFormat(item)}>{format === item && <Check />}{item}</button>)}</div></fieldset><label><span>{tx('現在のファイル', 'Current file')}</span><div className="file-picker"><Paperclip /><input type="file" onChange={(event) => setFile(event.target.files?.[0]?.name ?? '')} /><span>{file || tx('ファイルを選択', 'Choose a file')}</span></div></label><label><span>{tx('ご要望', 'Requirements')}</span><textarea value={request} onChange={(event) => setRequest(event.target.value)} /></label><label><span>{tx('連絡先メール', 'Contact email')}</span><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><button className="primary-button" type="submit">{tx('見積もりを依頼', 'Request a quote')}</button></form></div>;
}

export function CustomQuoteScreen({ locale, navigate, status, setStatus }: { locale: Locale; navigate: Navigate; status: CustomOrderStatus; setStatus: Dispatch<SetStateAction<CustomOrderStatus>> }) {
  const tx = (ja: string, en: string) => translate(locale, ja, en); const mockQuote = 48000;
  if (status === 'paid') return <div className="screen"><PageTitle title={tx('専用シフト表連携', 'Custom integration')} back={() => navigate('settings')} /><div className="order-status"><span><Check /></span><h3>{tx('お支払い完了', 'Payment complete')}</h3><p>{tx('専用連携の制作を開始します。', 'Custom integration development will begin.')}</p><strong>{tx('制作準備中', 'Preparing development')}</strong></div></div>;
  return <div className="screen"><PageTitle title={tx('お見積もり', 'Quote')} back={() => navigate('customIntegration')} /><div className="quote-card"><small>{tx('個別見積もり・モック金額', 'CUSTOM QUOTE · MOCK AMOUNT')}</small><h3>{tx('専用Excel連携', 'Custom Excel integration')}</h3><strong>{money(mockQuote)}</strong><p>{tx('要件確認・出力テンプレート作成・動作確認を含みます。', 'Includes requirements review, template creation, and testing.')}</p></div>{status === 'quoted' ? <button className="primary-button full-button" onClick={() => setStatus('accepted')}>{tx('この内容で依頼', 'Accept quote')}</button> : <button className="primary-button full-button" onClick={() => setStatus('paid')}><CreditCard />{tx('支払いに進む', 'Complete mock payment')}</button>}<p className="prototype-price-note">{tx('表示金額はUX確認用のダミーです。', 'The displayed amount is a dummy value for UX review.')}</p></div>;
}

export function KioskScreen({ locale, navigate, staff }: { locale: Locale; navigate: Navigate; staff: StaffRecord[] }) {
  const tx = (ja: string, en: string) => translate(locale, ja, en); const [selected, setSelected] = useState(staff.find((person) => person.status === 'ACTIVE')?.id ?? ''); const [states, setStates] = useState<Record<string, AttendanceState>>({}); const person = staff.find((item) => item.id === selected); const state = states[selected] ?? 'before';
  function set(next: AttendanceState) { setStates((current) => ({ ...current, [selected]: next })); }
  return <div className="screen"><PageTitle title={tx('共用端末打刻', 'Shared kiosk')} back={() => navigate('settings')} /><div className="kiosk-console"><Smartphone /><h3>{tx('スタッフを選択', 'Select staff')}</h3><select value={selected} onChange={(event) => setSelected(event.target.value)}>{staff.filter((item) => item.status === 'ACTIVE').map((item) => <option key={item.id} value={item.id}>{item[locale]}</option>)}</select>{person && <div className="kiosk-state"><span className="avatar" style={{ background: person.color }}>{person.ja.slice(0, 1)}</span><h2>{person[locale]}</h2>{state === 'before' && <button className="primary-button" onClick={() => set('working')}>{tx('出勤', 'Clock in')}</button>}{state === 'working' && <><p>{tx('出勤 09:02 · 勤務中', 'Clocked in 09:02 · Working')}</p><div className="dual-actions"><button className="secondary-button" onClick={() => set('break')}>{tx('休憩開始', 'Start break')}</button><button className="primary-button" onClick={() => set('complete')}>{tx('退勤', 'Clock out')}</button></div></>}{state === 'break' && <><p>{tx('休憩中', 'On break')}</p><button className="primary-button" onClick={() => set('working')}>{tx('休憩終了', 'End break')}</button></>}{state === 'complete' && <div className="result-banner"><Check /> {tx('本日の勤務は終了しました', 'Today’s shift is complete')}<small>09:02 — 18:06</small></div>}</div>}</div></div>;
}

export type AuditEntry = { id: string; at: string; startBefore: string; startAfter: string; endBefore: string; endAfter: string; reason: string };

export function AttendanceDetailScreen({ locale, navigate, role, audits, setAudits }: { locale: Locale; navigate: Navigate; role: Role; audits: AuditEntry[]; setAudits: Dispatch<SetStateAction<AuditEntry[]>> }) {
  const tx = (ja: string, en: string) => translate(locale, ja, en); const currentStart = audits[0]?.startAfter ?? '09:02'; const currentEnd = audits[0]?.endAfter ?? '18:06'; const [editing, setEditing] = useState(false); const [start, setStart] = useState(currentStart); const [end, setEnd] = useState(currentEnd); const [breakStart, setBreakStart] = useState('12:00'); const [breakEnd, setBreakEnd] = useState('13:00'); const [reason, setReason] = useState('打刻時刻修正');
  function save(event: FormEvent) { event.preventDefault(); setAudits((current) => [{ id: String(Date.now()), at: '10/14 20:34', startBefore: currentStart, startAfter: start, endBefore: currentEnd, endAfter: end, reason }, ...current]); setEditing(false); }
  return <div className="screen"><PageTitle title={tx('10月14日の勤怠', 'Attendance · Oct 14')} subtitle={role === 'ADMIN' ? tx('田中 太郎', 'Taro Tanaka') : undefined} back={() => navigate('attendanceHistory')} action={role === 'ADMIN' && !editing ? <button className="text-button" onClick={() => setEditing(true)}>{tx('編集', 'Edit')}</button> : undefined} />{editing ? <form className="mock-form" onSubmit={save}><div className="split-fields"><label><span>{tx('出勤', 'Clock in')}</span><input type="time" value={start} onInput={(event) => setStart(event.currentTarget.value)} onChange={(event) => setStart(event.target.value)} /></label><label><span>{tx('退勤', 'Clock out')}</span><input type="time" value={end} onInput={(event) => setEnd(event.currentTarget.value)} onChange={(event) => setEnd(event.target.value)} /></label></div><div className="split-fields"><label><span>{tx('休憩開始', 'Break start')}</span><input type="time" value={breakStart} onInput={(event) => setBreakStart(event.currentTarget.value)} onChange={(event) => setBreakStart(event.target.value)} /></label><label><span>{tx('休憩終了', 'Break end')}</span><input type="time" value={breakEnd} onInput={(event) => setBreakEnd(event.currentTarget.value)} onChange={(event) => setBreakEnd(event.target.value)} /></label></div><label><span>{tx('修正理由', 'Reason')}</span><textarea required value={reason} onChange={(event) => setReason(event.target.value)} /></label><button className="primary-button" type="submit">{tx('保存', 'Save')}</button></form> : <div className="attendance-record"><Clock3 /><div><span>{tx('出勤', 'Clock in')}</span><strong>{audits[0]?.startAfter ?? '09:02'}</strong></div><div><span>{tx('退勤', 'Clock out')}</span><strong>{audits[0]?.endAfter ?? '18:06'}</strong></div><div><span>{tx('休憩', 'Break')}</span><strong>12:00 — 13:00</strong></div></div>}<h3 className="subheading">{tx('修正履歴', 'Audit history')}</h3>{audits.length ? <div className="audit-list">{audits.map((entry) => <article key={entry.id}><small>{entry.at}</small><strong>{tx('管理者が修正', 'Edited by admin')}</strong><p>{tx('出勤', 'Clock in')} {entry.startBefore} → {entry.startAfter}</p><p>{tx('退勤', 'Clock out')} {entry.endBefore} → {entry.endAfter}</p><em>{tx('理由', 'Reason')}: {entry.reason}</em></article>)}</div> : <div className="quiet-empty"><p>{tx('修正履歴はありません。', 'No edit history.')}</p></div>}</div>;
}

const workdays = [{ date: '10/14', minutes: 484 }, { date: '10/13', minutes: 477 }, { date: '10/10', minutes: 455 }, { date: '10/08', minutes: 490 }];

export function PayrollScreen({ locale, navigate, role, staff, setStaff, selectedStaffId, setSelectedStaffId }: { locale: Locale; navigate: Navigate; role: Role; staff: StaffRecord[]; setStaff: Dispatch<SetStateAction<StaffRecord[]>>; selectedStaffId: string; setSelectedStaffId: Dispatch<SetStateAction<string>> }) {
  const tx = (ja: string, en: string) => translate(locale, ja, en); const [month, setMonth] = useState('2026-10'); const person = staff.find((item) => item.id === selectedStaffId) ?? staff[0]; const [editingRate, setEditingRate] = useState(false); const [rate, setRate] = useState(String(person.hourlyRate)); const totalMinutes = workdays.reduce((sum, day) => sum + day.minutes, 0); const total = Math.round((totalMinutes / 60) * person.hourlyRate);
  const breakdown = useMemo(() => workdays.map((day) => ({ ...day, pay: Math.round(day.minutes / 60 * person.hourlyRate) })), [person.hourlyRate]);
  return <div className="screen"><PageTitle title={tx('給与概算', 'Estimated pay')} back={() => navigate('settings')} />{role === 'ADMIN' && <label className="standalone-field"><span>{tx('スタッフ', 'Staff')}</span><select value={person.id} onChange={(event) => { setSelectedStaffId(event.target.value); setRate(String(staff.find((item) => item.id === event.target.value)?.hourlyRate ?? 0)); }}>{staff.filter((item) => item.status !== 'DISABLED').map((item) => <option key={item.id} value={item.id}>{item[locale]}</option>)}</select></label>}<label className="standalone-field"><span>{tx('対象月', 'Month')}</span><select value={month} onChange={(event) => setMonth(event.target.value)}><option value="2026-10">2026年10月</option><option value="2026-09">2026年9月</option></select></label><section className="payroll-summary"><WalletCards /><h3>{person[locale]}</h3><p>{tx(`勤務日数 ${workdays.length}日 · 勤務時間 ${Math.floor(totalMinutes / 60)}時間${totalMinutes % 60}分`, `${workdays.length} days · ${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`)}</p><small>{tx('給与概算', 'ESTIMATED PAY')}</small><strong>{money(total)}</strong><div><span>{tx('時給', 'Hourly rate')} {money(person.hourlyRate)}</span>{role === 'ADMIN' && <button onClick={() => setEditingRate(!editingRate)}>{tx('変更', 'Change')}</button>}</div></section>{editingRate && <form className="inline-rate-form" onSubmit={(event) => { event.preventDefault(); setStaff((current) => current.map((item) => item.id === person.id ? { ...item, hourlyRate: Number(rate) } : item)); setEditingRate(false); }}><input type="number" min="0" value={rate} onChange={(event) => setRate(event.target.value)} /><button className="primary-button" type="submit">{tx('保存', 'Save')}</button></form>}<h3 className="subheading">{tx('勤務内訳', 'Daily breakdown')}</h3><div className="list-card">{breakdown.map((day) => <div className="pay-row" key={day.date}><span><strong>{day.date}</strong><small>{Math.floor(day.minutes / 60)}h {day.minutes % 60}m</small></span><strong>{money(day.pay)}</strong></div>)}</div><div className="form-note"><AlertTriangle /><p>{tx('税・交通費・各種控除を含まない参考額です。', 'Estimate excludes taxes, transit, and deductions.')}</p></div></div>;
}

export function ExpiredScreen({ locale, role, navigate }: { locale: Locale; role: Role; navigate: Navigate }) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  return <div className="screen expired-screen"><LockKeyhole /><h2>{role === 'ADMIN' ? tx('無料体験期間が終了しました', 'Your free trial has ended') : tx('現在この店舗ではCrewamiを利用できません。', 'Crewami is currently unavailable for this store.')}</h2><p>{role === 'ADMIN' ? tx('Crewamiを引き続き利用するにはプランを選択してください。', 'Choose a plan to continue using Crewami.') : tx('管理者にご確認ください。', 'Please contact your administrator.')}</p>{role === 'ADMIN' && <button className="primary-button" onClick={() => navigate('subscription')}>{tx('プランを見る', 'View plans')}<ArrowRight /></button>}<button className="secondary-button" onClick={() => navigate('settings')}>{tx('設定を開く', 'Open settings')}</button></div>;
}
