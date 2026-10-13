'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronRight, Minus, X } from 'lucide-react';
import {
  getShiftStatus,
  rangeStyle,
  translate,
  type Locale,
  type ShiftDay,
  type StaffRecord,
  type StaffShift,
  type TimeRange,
} from '@/lib/prototype';

type ScheduleTimelineProps = {
  locale: Locale;
  staff: StaffRecord[];
  days: ShiftDay[];
  setDays: React.Dispatch<React.SetStateAction<ShiftDay[]>>;
  onReview: () => void;
};

const statusOrder = { CONFIRMED: 0, UNCONFIRMED: 1, NO_AVAILABILITY: 2 } as const;

function TimelineHeader() {
  return (
    <div className="timeline-header" aria-hidden="true">
      {Array.from({ length: 25 }, (_, hour) => (
        <span key={hour} style={{ left: `${(hour / 24) * 100}%` }}>
          {hour % 3 === 0 ? `${String(hour).padStart(2, '0')}:00` : ''}
        </span>
      ))}
    </div>
  );
}

function AvailabilityBar({ range }: { range: TimeRange }) {
  return <span className="availability-bar" style={rangeStyle(range)} title={`${range.start}–${range.end}`} />;
}

function ConfirmedShiftBar({ range }: { range: TimeRange }) {
  return (
    <span className="confirmed-bar" style={rangeStyle(range)}>
      {range.start}–{range.end}
    </span>
  );
}

function StatusMark({ row, locale }: { row: StaffShift; locale: Locale }) {
  const status = getShiftStatus(row);
  if (status === 'CONFIRMED') {
    return <span className="shift-status shift-status--confirmed"><Check size={11} />{translate(locale, '確定', 'Confirmed')}</span>;
  }
  if (status === 'UNCONFIRMED') {
    return <span className="shift-status shift-status--unconfirmed">● {translate(locale, '未確定', 'Unconfirmed')}</span>;
  }
  return <span className="shift-status shift-status--none"><Minus size={11} />{translate(locale, '希望なし', 'No availability')}</span>;
}

function StaffShiftRow({
  row,
  onEdit,
}: {
  row: StaffShift;
  onEdit: () => void;
}) {
  return (
    <div className="staff-shift-row">
      <button className="timeline-track" onClick={onEdit}>
        {row.availability && <AvailabilityBar range={row.availability} />}
        {row.confirmed && <ConfirmedShiftBar range={row.confirmed} />}
      </button>
    </div>
  );
}

function ShiftEditorSheet({
  locale,
  member,
  row,
  onClose,
  onSave,
  onUnconfirm,
}: {
  locale: Locale;
  member: StaffRecord;
  row: StaffShift;
  onClose: () => void;
  onSave: (range: TimeRange) => void;
  onUnconfirm: () => void;
}) {
  const seed = row.confirmed ?? row.availability ?? { start: '09:00', end: '17:00' };
  const [start, setStart] = useState(seed.start);
  const [end, setEnd] = useState(seed.end);
  const valid = start < end;

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <section className="shift-editor-sheet" role="dialog" aria-modal="true" aria-labelledby="shift-editor-title" onClick={(event) => event.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title-row">
          <div><small>{translate(locale, 'シフト編集', 'Edit shift')}</small><h3 id="shift-editor-title">{member[locale]}</h3></div>
          <button className="icon-button" onClick={onClose} aria-label={translate(locale, '閉じる', 'Close')}><X size={18} /></button>
        </div>
        {row.availability ? (
          <div className="availability-note"><span className="availability-swatch" />{translate(locale, '勤務希望', 'Availability')} {row.availability.start}–{row.availability.end}</div>
        ) : (
          <div className="availability-note availability-note--empty">{translate(locale, '勤務希望は提出されていません', 'No availability was submitted')}</div>
        )}
        <div className="time-fields">
          <label><span>{translate(locale, '開始', 'Start')}</span><input type="time" step="1800" value={start} onChange={(event) => setStart(event.target.value)} /></label>
          <span>—</span>
          <label><span>{translate(locale, '終了', 'End')}</span><input type="time" step="1800" value={end} onChange={(event) => setEnd(event.target.value)} /></label>
        </div>
        {!valid && <p className="form-error">{translate(locale, '終了時刻は開始時刻より後にしてください。', 'End time must be after start time.')}</p>}
        <div className="sheet-actions">
          {row.confirmed && <button className="secondary-button danger-button" onClick={onUnconfirm}>{translate(locale, '確定を解除', 'Unconfirm')}</button>}
          <button className="primary-button" disabled={!valid} onClick={() => onSave({ start, end })}>{translate(locale, 'この内容で確定', 'Confirm shift')}</button>
        </div>
      </section>
    </div>
  );
}

export function ScheduleTimeline({ locale, staff, days, setDays, onReview }: ScheduleTimelineProps) {
  const [dayIndex, setDayIndex] = useState(0);
  const [editorId, setEditorId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const day = days[dayIndex];
  const rows = useMemo(
    () => [...day.rows].sort((a, b) => statusOrder[getShiftStatus(a)] - statusOrder[getShiftStatus(b)]),
    [day],
  );
  const counts = rows.reduce(
    (all, row) => ({ ...all, [getShiftStatus(row)]: all[getShiftStatus(row)] + 1 }),
    { CONFIRMED: 0, UNCONFIRMED: 0, NO_AVAILABILITY: 0 },
  );

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 9 * 40;
  }, [dayIndex]);

  function updateRow(staffId: string, confirmed?: TimeRange) {
    setDays((current) => current.map((item, index) => index === dayIndex
      ? { ...item, rows: item.rows.map((row) => row.staffId === staffId ? { ...row, confirmed } : row) }
      : item));
    setEditorId(null);
  }

  function applyPreset(start: string, end: string) {
    setDays((current) => current.map((item, index) => index === dayIndex
      ? { ...item, rows: item.rows.map((row) => row.availability ? { ...row, confirmed: { start, end } } : row) }
      : item));
  }

  const editorRow = rows.find((row) => row.staffId === editorId);
  const editorMember = staff.find((member) => member.id === editorId);

  return (
    <section className="schedule-workspace">
      <div className="date-strip" role="tablist" aria-label={translate(locale, '日付', 'Dates')}>
        {days.map((item, index) => <button key={item.id} role="tab" aria-selected={dayIndex === index} className={dayIndex === index ? 'active' : ''} onClick={() => setDayIndex(index)}>{item[locale]}</button>)}
      </div>

      <div className="timeline-summary">
        <div><strong>{counts.CONFIRMED}</strong><span>{translate(locale, '確定', 'Confirmed')}</span></div>
        <div><strong>{counts.UNCONFIRMED}</strong><span>{translate(locale, '未確定', 'Unconfirmed')}</span></div>
        <div><strong>{counts.NO_AVAILABILITY}</strong><span>{translate(locale, '希望なし', 'No availability')}</span></div>
      </div>

      <div className="shift-shortcuts" aria-label={translate(locale, '一括設定', 'Bulk presets')}>
        <span>{translate(locale, '一括設定', 'Bulk')}</span>
        <button onClick={() => applyPreset('00:00', '23:30')}>{translate(locale, '全時間', 'All')}</button>
        <button onClick={() => applyPreset('06:00', '12:00')}>{translate(locale, '朝', 'Morning')}</button>
        <button onClick={() => applyPreset('09:00', '18:00')}>{translate(locale, '日中', 'Day')}</button>
        <button onClick={() => applyPreset('17:00', '23:30')}>{translate(locale, '夜', 'Night')}</button>
      </div>

      <div className="timeline-legend">
        <span><i className="legend-availability" />{translate(locale, '勤務希望', 'Availability')}</span>
        <span><i className="legend-confirmed" />{translate(locale, '確定シフト', 'Confirmed shift')}</span>
      </div>

      <div className="timeline-frame">
        <div className="timeline-name-column">
          <div className="timeline-name-heading">{translate(locale, 'スタッフ', 'Staff')}</div>
          {rows.map((row) => {
            const member = staff.find((person) => person.id === row.staffId);
            return member ? (
              <button key={row.staffId} className="timeline-person" onClick={() => setEditorId(row.staffId)} aria-label={`${member[locale]} ${translate(locale, 'を編集', 'edit')}`}>
                <span className="avatar avatar--small" style={{ background: member.color }}>{member[locale].slice(0, 1)}</span>
                <span><strong>{member[locale]}</strong><StatusMark row={row} locale={locale} /></span>
                <ChevronRight size={14} />
              </button>
            ) : null;
          })}
        </div>
        <div className="timeline-scroll" ref={scrollRef}>
          <div className="timeline-grid">
            <TimelineHeader />
            {rows.map((row) => {
              const member = staff.find((person) => person.id === row.staffId);
              return member ? <StaffShiftRow key={row.staffId} row={row} onEdit={() => setEditorId(row.staffId)} /> : null;
            })}
          </div>
        </div>
      </div>

      <button className="primary-button full-button" onClick={onReview}>{translate(locale, '公開内容を確認', 'Review and publish')}</button>

      {editorRow && editorMember && (
        <ShiftEditorSheet locale={locale} member={editorMember} row={editorRow} onClose={() => setEditorId(null)} onSave={(range) => updateRow(editorRow.staffId, range)} onUnconfirm={() => updateRow(editorRow.staffId, undefined)} />
      )}
    </section>
  );
}
