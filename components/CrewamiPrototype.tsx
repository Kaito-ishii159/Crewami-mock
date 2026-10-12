'use client';

import { useEffect, useState } from 'react';
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Clock3,
  Home,
  MapPinned,
  Menu,
  Sparkles,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { BrandMark } from './BrandMark';
import { PrototypeScreens } from './PrototypeScreens';
import {
  scenarioLabels,
  stores,
  translate,
  type AttendanceState,
  type Locale,
  type Role,
  type Scenario,
  type Screen,
} from '@/lib/prototype';

export interface ModalState {
  type: 'store' | 'qr' | 'notice' | 'success' | 'shiftPreview' | null;
  title?: string;
  body?: string;
}

const scenarios = Object.keys(scenarioLabels) as Scenario[];

export function CrewamiPrototype() {
  const [role, setRole] = useState<Role>('OWNER');
  const [locale, setLocale] = useState<Locale>('ja');
  const [scenario, setScenario] = useState<Scenario>('normal');
  const [screen, setScreen] = useState<Screen>('home');
  const [storeIndex, setStoreIndex] = useState(0);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [attendance, setAttendance] = useState<AttendanceState>('before');
  const [gpsSharing, setGpsSharing] = useState(false);
  const [applied, setApplied] = useState(false);
  const [hired, setHired] = useState(false);
  const [published, setPublished] = useState(false);
  const [assigned, setAssigned] = useState<string[]>(['田中 太郎']);

  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const isMember = role === 'MEMBER';

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function changeRole(nextRole: Role) {
    setRole(nextRole);
    setScreen('home');
    setScenario('normal');
    setAttendance('before');
  }

  function applyScenario(nextScenario: Scenario) {
    setScenario(nextScenario);
    if (nextScenario === 'collecting') setScreen('collection');
    if (nextScenario === 'building') setScreen('builder');
    if (nextScenario === 'shortage') setScreen('openShifts');
    if (nextScenario === 'working') {
      setAttendance('working');
      setScreen(isMember ? 'attendance' : 'teamAttendance');
    }
    if (nextScenario === 'break') {
      setAttendance('break');
      setScreen(isMember ? 'attendance' : 'teamAttendance');
    }
    if (nextScenario === 'unpaid' || nextScenario === 'trial' || nextScenario === 'paid') {
      setRole('OWNER');
      setScreen('subscription');
    }
    if (nextScenario === 'normal') setScreen('home');
  }

  const ownerNav: Array<{ screen: Screen; label: string; icon: typeof Home }> = [
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
  const navItems = isMember ? memberNav : ownerNav;

  return (
    <main className="prototype-canvas">
      <section className="preview-intro" aria-label="Prototype information">
        <div className="preview-brand">
          <BrandMark />
          <div>
            <span>Crewami</span>
            <small>INTERACTIVE PREVIEW</small>
          </div>
        </div>
        <h1>{tx('働くチームに、ちょうどいい。', 'Everything your team needs. Nothing it doesn’t.')}</h1>
        <p>
          {tx(
            '小さなチームのシフト・勤怠・連携を、ひとつのやさしい体験に。',
            'A focused workspace for schedules, attendance, and day-to-day team coordination.',
          )}
        </p>
        <div className="preview-hint">
          <Sparkles size={16} />
          <span>{tx('端末内のボタンは実際に操作できます', 'Everything inside the phone is interactive')}</span>
        </div>
      </section>

      <section className="device-stage">
        <div className="device" aria-label="Crewami mobile app prototype">
          <div className="device-island" aria-hidden="true" />
          <div className="app-surface">
            <div className="status-bar" aria-hidden="true">
              <strong>9:41</strong>
              <span className="status-icons">● ◒ ▰</span>
            </div>
            <header className="app-header">
              <button className="store-switch" onClick={() => setModal({ type: 'store' })}>
                <span className="mini-logo"><BrandMark compact /></span>
                <span>
                  <small>{tx('ワークスペース', 'WORKSPACE')}</small>
                  <strong>{stores[locale][storeIndex]}</strong>
                </span>
                <ChevronDown size={16} />
              </button>
              <button
                className="icon-button"
                aria-label={tx('通知', 'Notifications')}
                onClick={() =>
                  setModal({
                    type: 'notice',
                    title: tx('通知', 'Notifications'),
                    body: tx('新しい通知はありません。', 'You’re all caught up.'),
                  })
                }
              >
                <Bell size={19} />
                <span className="notification-dot" />
              </button>
            </header>

            <div className="screen-scroll" key={`${role}-${screen}-${locale}`}>
              <PrototypeScreens
                role={role}
                locale={locale}
                scenario={scenario}
                screen={screen}
                storeIndex={storeIndex}
                attendance={attendance}
                gpsSharing={gpsSharing}
                applied={applied}
                hired={hired}
                published={published}
                assigned={assigned}
                navigate={setScreen}
                setAttendance={setAttendance}
                setGpsSharing={setGpsSharing}
                setApplied={setApplied}
                setHired={setHired}
                setPublished={setPublished}
                setAssigned={setAssigned}
                openModal={setModal}
              />
            </div>

            <nav className="bottom-nav" aria-label={tx('メインナビゲーション', 'Main navigation')}>
              {navItems.map((item) => {
                const active = item.screen === screen ||
                  (item.screen === 'builder' && ['collection', 'publish', 'availability'].includes(screen)) ||
                  (item.screen === 'settings' && ['gps', 'stores', 'subscription', 'payroll', 'correction', 'kiosk', 'feedback', 'staffDetail'].includes(screen));
                return (
                  <button
                    key={item.screen}
                    className={active ? 'nav-item nav-item--active' : 'nav-item'}
                    onClick={() => setScreen(item.screen)}
                    aria-current={active ? 'page' : undefined}
                  >
                    <item.icon size={21} strokeWidth={active ? 2.4 : 1.8} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </section>

      <aside className="preview-controller" aria-label="Preview Controller">
        <div className="controller-heading">
          <span className="controller-pulse" />
          <div>
            <strong>Preview Controller</strong>
            <small>{tx('開発・評価用', 'Development only')}</small>
          </div>
        </div>

        <fieldset>
          <legend>Role</legend>
          <div className="controller-segment controller-segment--three">
            {(['OWNER', 'MANAGER', 'MEMBER'] as Role[]).map((item) => (
              <button key={item} className={role === item ? 'active' : ''} onClick={() => changeRole(item)}>
                {item[0] + item.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Language</legend>
          <div className="controller-segment">
            <button className={locale === 'ja' ? 'active' : ''} onClick={() => setLocale('ja')}>日本語</button>
            <button className={locale === 'en' ? 'active' : ''} onClick={() => setLocale('en')}>English</button>
          </div>
        </fieldset>

        <label className="scenario-select">
          <span>Scenario</span>
          <select value={scenario} onChange={(event) => applyScenario(event.target.value as Scenario)}>
            {scenarios.map((item) => (
              <option key={item} value={item}>{scenarioLabels[item][locale]}</option>
            ))}
          </select>
        </label>

        <div className="controller-meta">
          <span><UserRound size={14} /> {role}</span>
          <span><MapPinned size={14} /> {stores[locale][storeIndex]}</span>
        </div>
      </aside>

      {modal.type && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setModal({ type: null })}>
          <section className="bottom-sheet" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <div className="sheet-handle" />
            {modal.type === 'store' ? (
              <>
                <div className="sheet-title">
                  <div><small>{tx('表示中の店舗', 'CURRENT STORE')}</small><h2>{tx('店舗を切り替える', 'Switch store')}</h2></div>
                </div>
                <div className="store-options">
                  {stores[locale].map((store, index) => (
                    <button key={store} className={storeIndex === index ? 'selected' : ''} onClick={() => { setStoreIndex(index); setModal({ type: null }); }}>
                      <span className="store-symbol">{['S', 'N', 'I'][index]}</span>
                      <span><strong>{store}</strong><small>{[12, 8, 6][index]} {tx('人のスタッフ', 'staff members')}</small></span>
                      <span className="radio-check">{storeIndex === index ? '✓' : ''}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : modal.type === 'qr' ? (
              <div className="qr-dialog">
                <small>{tx('登録不要', 'NO SIGN-UP NEEDED')}</small>
                <h2>{tx('回答用QRコード', 'Availability QR code')}</h2>
                <div className="mock-qr" aria-label="Mock QR code">
                  {Array.from({ length: 81 }).map((_, index) => <i key={index} className={[0,1,2,3,4,9,13,18,22,27,31,36,37,38,39,40,44,49,53,54,55,56,57,58,60,62,64,66,68,70,72,74,76,78,80].includes(index) ? 'on' : ''} />)}
                </div>
                <p>{tx('スタッフはアプリ登録なしで希望を提出できます。', 'Staff can submit availability without creating an account.')}</p>
                <button className="primary-button" onClick={() => { setModal({ type: null }); setScreen('availability'); }}>{tx('回答画面を開く', 'Open response page')}</button>
              </div>
            ) : modal.type === 'shiftPreview' ? (
              <div className="shift-preview-dialog">
                <small>{tx('スタッフ表示', 'STAFF VIEW')}</small>
                <h2>{tx('11月10日（月）', 'Monday, November 10')}</h2>
                <div className="preview-shift-card"><CalendarDays size={20} /><span><strong>18:00 — 22:00</strong><small>{stores[locale][storeIndex]} · 4h</small></span></div>
                <p>{tx('この内容でスタッフへ通知されます。', 'This is what staff will receive when you publish.')}</p>
                <button className="primary-button" onClick={() => setModal({ type: null })}>{tx('確認しました', 'Looks good')}</button>
              </div>
            ) : (
              <div className="message-dialog">
                <span className="success-orb">✓</span>
                <h2>{modal.title}</h2>
                <p>{modal.body}</p>
                <button className="primary-button" onClick={() => setModal({ type: null })}>{tx('閉じる', 'Close')}</button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
