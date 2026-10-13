'use client';

import { useEffect, useState } from 'react';
import { Bell, BriefcaseBusiness, CalendarDays, ChevronDown, Clock3, Home, MapPinned, Menu, Sparkles, UserRound, UsersRound } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { PrototypeScreens } from './PrototypeScreens';
import { initialShiftDays, initialStaff, initialStores, scenarioLabels, translate, type AttendanceState, type Locale, type Role, type Scenario, type Screen } from '@/lib/prototype';

export interface ModalState {
  type: 'store' | 'qr' | 'notice' | 'success' | 'shiftPreview' | 'confirm' | null;
  title?: string;
  body?: string;
  onConfirm?: () => void;
}

const scenarios = Object.keys(scenarioLabels) as Scenario[];

export function CrewamiPrototype() {
  const [role, setRole] = useState<Role>('ADMIN');
  const [locale, setLocale] = useState<Locale>('ja');
  const [scenario, setScenario] = useState<Scenario>('normal');
  const [screen, setScreen] = useState<Screen>('home');
  const [storeId, setStoreId] = useState('shibuya');
  const [stores, setStores] = useState(initialStores);
  const [staff, setStaff] = useState(initialStaff);
  const [shiftDays, setShiftDays] = useState(initialShiftDays);
  const [selectedStaffId, setSelectedStaffId] = useState('tanaka');
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [attendance, setAttendance] = useState<AttendanceState>('before');
  const [gpsSharing, setGpsSharing] = useState(false);
  const [applied, setApplied] = useState(false);
  const [hired, setHired] = useState(false);
  const [published, setPublished] = useState(false);
  const [availabilitySubmitted, setAvailabilitySubmitted] = useState(false);
  const [collectionActive, setCollectionActive] = useState(true);
  const [correctionStatus, setCorrectionStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [notifications, setNotifications] = useState({ shift: true, attendance: true, recruitment: false });

  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const isMember = role === 'MEMBER';
  const activeStore = stores.find((store) => store.id === storeId) ?? stores[0];

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  function changeRole(nextRole: Role) {
    setRole(nextRole);
    setScreen('home');
    setScenario('normal');
    setAttendance('before');
  }

  function applyScenario(nextScenario: Scenario) {
    setScenario(nextScenario);
    if (nextScenario === 'normal') setScreen('home');
    if (nextScenario === 'collecting') { setCollectionActive(true); setScreen('collection'); }
    if (nextScenario === 'building') setScreen('builder');
    if (nextScenario === 'shortage') setScreen('openShifts');
    if (nextScenario === 'working') { setAttendance('working'); setScreen(isMember ? 'attendance' : 'teamAttendance'); }
    if (nextScenario === 'trial' || nextScenario === 'paid') { setRole('ADMIN'); setScreen('subscription'); }
  }

  const adminNav: Array<{ screen: Screen; label: string; icon: typeof Home }> = [
    { screen: 'home', label: tx('ホーム', 'Home'), icon: Home },
    { screen: 'builder', label: tx('シフト', 'Schedule'), icon: CalendarDays },
    { screen: 'teamAttendance', label: tx('勤怠', 'Attendance'), icon: Clock3 },
    { screen: 'staff', label: tx('スタッフ', 'Staff'), icon: UsersRound },
    { screen: 'settings', label: tx('その他', 'More'), icon: Menu },
  ];
  const memberNav: Array<{ screen: Screen; label: string; icon: typeof Home }> = [
    { screen: 'home', label: tx('ホーム', 'Home'), icon: Home },
    { screen: 'schedule', label: tx('シフト', 'Schedule'), icon: CalendarDays },
    { screen: 'attendance', label: tx('勤怠', 'Attendance'), icon: Clock3 },
    { screen: 'openShifts', label: tx('募集中', 'Open shifts'), icon: BriefcaseBusiness },
    { screen: 'settings', label: tx('その他', 'More'), icon: Menu },
  ];
  const navItems = isMember ? memberNav : adminNav;
  const settingsScreens: Screen[] = ['gps', 'stores', 'storeForm', 'subscription', 'payroll', 'correction', 'correctionReview', 'kiosk', 'feedback', 'staffDetail', 'staffForm', 'notifications', 'language', 'attendanceHistory', 'attendanceDetail'];

  return (
    <main className="prototype-canvas">
      <section className="preview-intro" aria-label="Prototype information">
        <div className="preview-brand"><BrandMark /><div><span>Crewami</span><small>INTERACTIVE PREVIEW</small></div></div>
        <h1>{tx('働くチームに、ちょうどいい。', 'Everything your team needs. Nothing it doesn’t.')}</h1>
        <p>{tx('小さなチームのシフト・勤怠・連携を、ひとつのやさしい体験に。', 'A focused workspace for schedules, attendance, and everyday team coordination.')}</p>
        <div className="preview-hint"><Sparkles size={16} /><span>{tx('端末内のボタンは実際に操作できます', 'Everything inside the phone is interactive')}</span></div>
      </section>

      <section className="device-stage"><div className="device" aria-label="Crewami mobile app prototype"><div className="device-island" aria-hidden="true" /><div className="app-surface">
        <div className="status-bar" aria-hidden="true"><strong>9:41</strong><span className="status-icons">● ◒ ▰</span></div>
        <header className="app-header">
          <button className="store-switch" onClick={() => setModal({ type: 'store' })}><span className="mini-logo"><BrandMark compact /></span><span><small>{tx('ワークスペース', 'WORKSPACE')}</small><strong>{activeStore[locale]}</strong></span><ChevronDown size={16} /></button>
          <button className="icon-button" aria-label={tx('通知', 'Notifications')} onClick={() => setScreen('notifications')}><Bell size={19} /><span className="notification-dot" /></button>
        </header>
        <div className="screen-scroll" key={`${role}-${screen}-${locale}`}>
          <PrototypeScreens role={role} locale={locale} scenario={scenario} screen={screen} storeId={storeId}
            stores={stores} setStores={setStores} staff={staff} setStaff={setStaff} shiftDays={shiftDays} setShiftDays={setShiftDays}
            selectedStaffId={selectedStaffId} setSelectedStaffId={setSelectedStaffId} editingStaffId={editingStaffId} setEditingStaffId={setEditingStaffId}
            editingStoreId={editingStoreId} setEditingStoreId={setEditingStoreId} attendance={attendance} setAttendance={setAttendance}
            gpsSharing={gpsSharing} setGpsSharing={setGpsSharing} applied={applied} setApplied={setApplied} hired={hired} setHired={setHired}
            published={published} setPublished={setPublished} availabilitySubmitted={availabilitySubmitted} setAvailabilitySubmitted={setAvailabilitySubmitted}
            collectionActive={collectionActive} setCollectionActive={setCollectionActive} correctionStatus={correctionStatus} setCorrectionStatus={setCorrectionStatus}
            notifications={notifications} setNotifications={setNotifications} setLocale={setLocale} navigate={setScreen} openModal={setModal} />
        </div>
        <nav className="bottom-nav" aria-label={tx('メインナビゲーション', 'Main navigation')}>{navItems.map((item) => {
          const active = item.screen === screen || (item.screen === 'builder' && ['collection', 'availabilityRequest', 'publish'].includes(screen)) || (item.screen === 'settings' && settingsScreens.includes(screen));
          return <button key={item.screen} className={active ? 'nav-item nav-item--active' : 'nav-item'} onClick={() => setScreen(item.screen)} aria-current={active ? 'page' : undefined}><item.icon size={21} strokeWidth={active ? 2.4 : 1.8} /><span>{item.label}</span></button>;
        })}</nav>
      </div></div></section>

      <aside className="preview-controller" aria-label="Preview Controller">
        <div className="controller-heading"><span className="controller-pulse" /><div><strong>Preview Controller</strong><small>{tx('開発・評価用', 'Development only')}</small></div></div>
        <fieldset><legend>Role</legend><div className="controller-segment">{(['ADMIN', 'MEMBER'] as Role[]).map((item) => <button key={item} className={role === item ? 'active' : ''} onClick={() => changeRole(item)}>{item === 'ADMIN' ? 'Admin' : 'Member'}</button>)}</div></fieldset>
        <fieldset><legend>Language</legend><div className="controller-segment"><button className={locale === 'ja' ? 'active' : ''} onClick={() => setLocale('ja')}>日本語</button><button className={locale === 'en' ? 'active' : ''} onClick={() => setLocale('en')}>English</button></div></fieldset>
        <label className="scenario-select"><span>Scenario</span><select value={scenario} onChange={(event) => applyScenario(event.target.value as Scenario)}>{scenarios.map((item) => <option key={item} value={item}>{scenarioLabels[item][locale]}</option>)}</select></label>
        <div className="controller-meta"><span><UserRound size={14} /> {role}</span><span><MapPinned size={14} /> {activeStore[locale]}</span></div>
      </aside>

      {modal.type && <div className="modal-backdrop" role="presentation" onMouseDown={() => setModal({ type: null })}><section className="bottom-sheet" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><div className="sheet-handle" />
        {modal.type === 'store' ? <><div className="sheet-title"><div><small>{tx('表示中の店舗', 'CURRENT STORE')}</small><h2>{tx('店舗を切り替える', 'Switch store')}</h2></div></div><div className="store-options">{stores.map((store) => <button key={store.id} className={storeId === store.id ? 'selected' : ''} onClick={() => { setStoreId(store.id); setModal({ type: null }); }}><span className="store-symbol">{store.en[0]}</span><span><strong>{store[locale]}</strong><small>{staff.filter((member) => member.storeId === store.id && member.active).length} {tx('人のスタッフ', 'staff members')}</small></span><span className="radio-check">{storeId === store.id ? '✓' : ''}</span></button>)}</div></>
        : modal.type === 'qr' ? <div className="qr-dialog"><small>{tx('登録不要', 'NO SIGN-UP NEEDED')}</small><h2>{tx('回答用QRコード', 'Availability QR code')}</h2><div className="mock-qr" aria-label="Mock QR code">{Array.from({ length: 81 }).map((_, index) => <i key={index} className={[0,1,2,3,4,9,13,18,22,27,31,36,37,38,39,40,44,49,53,54,55,56,57,58,60,62,64,66,68,70,72,74,76,78,80].includes(index) ? 'on' : ''} />)}</div><p>{tx('スタッフはアプリ登録なしで希望を提出できます。', 'Staff can submit availability without creating an account.')}</p><button className="primary-button" onClick={() => { setModal({ type: null }); setScreen('availability'); }}>{tx('回答画面を開く', 'Open response page')}</button></div>
        : modal.type === 'shiftPreview' ? <div className="shift-preview-dialog"><small>{tx('スタッフ表示', 'STAFF VIEW')}</small><h2>{tx('11月10日（火）', 'Tuesday, November 10')}</h2><div className="preview-shift-card"><CalendarDays size={20} /><span><strong>09:00 — 17:00</strong><small>{activeStore[locale]} · 8h</small></span></div><p>{tx('この内容でスタッフへ通知されます。', 'This is what staff will receive when you publish.')}</p><button className="primary-button" onClick={() => setModal({ type: null })}>{tx('確認しました', 'Looks good')}</button></div>
        : modal.type === 'confirm' ? <div className="message-dialog"><span className="success-orb">?</span><h2>{modal.title}</h2><p>{modal.body}</p><div className="modal-actions"><button className="secondary-button" onClick={() => setModal({ type: null })}>{tx('キャンセル', 'Cancel')}</button><button className="primary-button" onClick={() => { const confirm = modal.onConfirm; setModal({ type: null }); confirm?.(); }}>{tx('実行する', 'Confirm')}</button></div></div>
        : <div className="message-dialog"><span className="success-orb">✓</span><h2>{modal.title}</h2><p>{modal.body}</p><button className="primary-button" onClick={() => setModal({ type: null })}>{tx('閉じる', 'Close')}</button></div>}
      </section></div>}
    </main>
  );
}
