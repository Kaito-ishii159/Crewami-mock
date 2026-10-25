"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronRight, Minus, X } from "lucide-react";
import {
  getShiftStatus,
  rangeStyle,
  translate,
  type Locale,
  type ShiftDay,
  type StaffRecord,
  type StaffShift,
  type TimeRange,
} from "@/lib/prototype";
import { dateLabel, monthLabel, validateRanges } from "@/lib/scheduling";

type ScheduleTimelineProps = {
  locale: Locale;
  staff: StaffRecord[];
  days: ShiftDay[];
  month: string;
  selectedDate: string;
  onMonthChange: (month: string) => void;
  onDateChange: (date: string) => void;
  onConfirm: (date: string, staffId: string, range?: TimeRange) => void;
  onReview: () => void;
};

const statusOrder = {
  CONFIRMED: 0,
  UNCONFIRMED: 1,
  NO_AVAILABILITY: 2,
} as const;

function TimelineHeader() {
  return (
    <div className="timeline-header" aria-hidden="true">
      {Array.from({ length: 25 }, (_, hour) => (
        <span key={hour} style={{ left: `${(hour / 24) * 100}%` }}>
          {hour % 3 === 0 ? `${String(hour).padStart(2, "0")}:00` : ""}
        </span>
      ))}
    </div>
  );
}

function AvailabilityBar({ range }: { range: TimeRange }) {
  return (
    <span
      className="availability-bar"
      style={rangeStyle(range)}
      title={`${range.start}–${range.end}`}
    />
  );
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
  if (status === "CONFIRMED") {
    return (
      <span className="shift-status shift-status--confirmed">
        <Check size={11} />
        {translate(locale, "確定", "Confirmed")}
      </span>
    );
  }
  if (status === "UNCONFIRMED") {
    return (
      <span className="shift-status shift-status--unconfirmed">
        ● {translate(locale, "未確定", "Unconfirmed")}
      </span>
    );
  }
  return (
    <span className="shift-status shift-status--none">
      <Minus size={11} />
      {translate(locale, "希望なし", "No availability")}
    </span>
  );
}

function StaffShiftRow({
  row,
  onEdit,
  label,
}: {
  row: StaffShift;
  onEdit: () => void;
  label: string;
}) {
  return (
    <div className="staff-shift-row">
      <button className="timeline-track" onClick={onEdit} aria-label={label}>
        {row.availabilityRanges.map((range, index) => (
          <AvailabilityBar key={index} range={range} />
        ))}
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
  const seed = row.confirmed ??
    row.availabilityRanges[0] ?? { start: "09:00", end: "17:00" };
  const [start, setStart] = useState(seed.start);
  const [end, setEnd] = useState(seed.end);
  const valid = !validateRanges([{ start, end }]);

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <section
        className="shift-editor-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shift-editor-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" />
        <div className="sheet-title-row">
          <div>
            <small>{translate(locale, "シフト編集", "Edit shift")}</small>
            <h3 id="shift-editor-title">{member[locale]}</h3>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label={translate(locale, "閉じる", "Close")}
          >
            <X size={18} />
          </button>
        </div>
        {row.availabilityRanges.length ? (
          <div className="availability-choices">
            <span className="availability-swatch" />
            <strong>
              {translate(
                locale,
                "希望時間帯から選ぶ",
                "Choose an availability range",
              )}
            </strong>
            {row.availabilityRanges.map((range, index) => (
              <button
                key={index}
                onClick={() => {
                  setStart(range.start);
                  setEnd(range.end);
                }}
              >
                {translate(
                  locale,
                  `希望${index + 1}を使う`,
                  `Use range ${index + 1}`,
                )}{" "}
                <b>
                  {range.start}–{range.end}
                </b>
              </button>
            ))}
          </div>
        ) : (
          <div className="availability-note availability-note--empty">
            {translate(
              locale,
              "勤務希望は提出されていません",
              "No availability was submitted",
            )}
          </div>
        )}
        <div className="time-fields">
          <label>
            <span>{translate(locale, "開始", "Start")}</span>
            <input
              type="time"
              step="1800"
              value={start}
              onInput={(event) => setStart(event.currentTarget.value)}
              onChange={(event) => setStart(event.target.value)}
            />
          </label>
          <span>—</span>
          <label>
            <span>{translate(locale, "終了", "End")}</span>
            <input
              type="text"
              inputMode="numeric"
              value={end}
              onChange={(event) => setEnd(event.target.value)}
            />
          </label>
        </div>
        {!valid && (
          <p className="form-error">
            {translate(
              locale,
              "終了時刻は開始時刻より後にしてください。",
              "End time must be after start time.",
            )}
          </p>
        )}
        <div className="sheet-actions">
          {row.confirmed && (
            <button
              className="secondary-button danger-button"
              onClick={onUnconfirm}
            >
              {translate(locale, "確定を解除", "Unconfirm")}
            </button>
          )}
          <button
            className="primary-button"
            disabled={!valid}
            onClick={() => onSave({ start, end })}
          >
            {translate(locale, "この内容で確定", "Confirm shift")}
          </button>
        </div>
      </section>
    </div>
  );
}

export function ScheduleTimeline({
  locale,
  staff,
  days,
  month,
  selectedDate,
  onMonthChange,
  onDateChange,
  onConfirm,
  onReview,
}: ScheduleTimelineProps) {
  const [editorId, setEditorId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const day = days.find((item) => item.id === selectedDate) ?? days[0];
  const selectedTabRef = useRef<HTMLButtonElement>(null);
  const rows = useMemo(
    () =>
      [...day.rows].sort(
        (a, b) =>
          statusOrder[getShiftStatus(a)] - statusOrder[getShiftStatus(b)],
      ),
    [day],
  );
  const counts = rows.reduce(
    (all, row) => ({
      ...all,
      [getShiftStatus(row)]: all[getShiftStatus(row)] + 1,
    }),
    { CONFIRMED: 0, UNCONFIRMED: 0, NO_AVAILABILITY: 0 },
  );

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 9 * 40;
    selectedTabRef.current?.scrollIntoView({
      block: "nearest",
      inline: "center",
    });
  }, [selectedDate]);

  function updateRow(staffId: string, confirmed?: TimeRange) {
    onConfirm(day.id, staffId, confirmed);
    setEditorId(null);
  }

  const editorRow = rows.find((row) => row.staffId === editorId);
  const editorMember = staff.find((member) => member.id === editorId);

  return (
    <section className="schedule-workspace">
      <label className="schedule-month-field">
        <span>{translate(locale, "対象月", "Schedule month")}</span>
        <input
          type="month"
          required
          value={month}
          onInput={(event) => {
            if (event.currentTarget.value) {
              setEditorId(null);
              onMonthChange(event.currentTarget.value);
            }
          }}
          onChange={(event) => {
            if (event.target.value) {
              setEditorId(null);
              onMonthChange(event.target.value);
            }
          }}
        />
      </label>
      <p className="schedule-date-heading">
        {monthLabel(month, locale)}{" "}
        <span>{translate(locale, "日付を選択", "Select a day")}</span>
      </p>
      <div
        className="date-strip"
        role="tablist"
        aria-label={translate(locale, "日付", "Dates")}
      >
        {days.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-label={item[locale]}
            aria-selected={day.id === item.id}
            ref={day.id === item.id ? selectedTabRef : undefined}
            className={day.id === item.id ? "active" : ""}
            onClick={() => {
              setEditorId(null);
              onDateChange(item.id);
            }}
          >
            <small>{dateLabel(item.id, locale, { weekday: "short" })}</small>
            <strong>{Number(item.id.slice(-2))}</strong>
          </button>
        ))}
      </div>

      <div className="timeline-summary">
        <div>
          <strong>{counts.CONFIRMED}</strong>
          <span>{translate(locale, "確定", "Confirmed")}</span>
        </div>
        <div>
          <strong>{counts.UNCONFIRMED}</strong>
          <span>{translate(locale, "未確定", "Unconfirmed")}</span>
        </div>
        <div>
          <strong>{counts.NO_AVAILABILITY}</strong>
          <span>{translate(locale, "希望なし", "No availability")}</span>
        </div>
      </div>

      <div className="timeline-legend">
        <span>
          <i className="legend-availability" />
          {translate(locale, "勤務希望", "Availability")}
        </span>
        <span>
          <i className="legend-confirmed" />
          {translate(locale, "確定シフト", "Confirmed shift")}
        </span>
      </div>

      <h3 className="timeline-selected-date">{day[locale]}</h3>
      <div
        className="timeline-frame"
        style={{ height: 38 + rows.length * 53 + 16 }}
      >
        <div className="timeline-name-column">
          <div className="timeline-name-heading">
            {translate(locale, "スタッフ", "Staff")}
          </div>
          {rows.map((row) => {
            const member = staff.find((person) => person.id === row.staffId);
            return member ? (
              <button
                key={row.staffId}
                className="timeline-person"
                onClick={() => setEditorId(row.staffId)}
                aria-label={`${member[locale]} ${translate(locale, "を編集", "edit")}`}
              >
                <span
                  className="avatar avatar--small"
                  style={{ background: member.color }}
                >
                  {member[locale].slice(0, 1)}
                </span>
                <span>
                  <strong>{member[locale]}</strong>
                  {member.role === "ADMIN" && (
                    <small className="timeline-admin-badge">
                      {translate(locale, "管理者", "Admin")}
                    </small>
                  )}
                  <StatusMark row={row} locale={locale} />
                </span>
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
              return member ? (
                <StaffShiftRow
                  key={row.staffId}
                  row={row}
                  label={`${member[locale]} ${day[locale]}`}
                  onEdit={() => setEditorId(row.staffId)}
                />
              ) : null;
            })}
          </div>
        </div>
      </div>

      <button className="primary-button full-button" onClick={onReview}>
        {translate(locale, "公開内容を確認", "Review and publish")}
      </button>

      {editorRow && editorMember && (
        <ShiftEditorSheet
          locale={locale}
          member={editorMember}
          row={editorRow}
          onClose={() => setEditorId(null)}
          onSave={(range) => updateRow(editorRow.staffId, range)}
          onUnconfirm={() => updateRow(editorRow.staffId, undefined)}
        />
      )}
    </section>
  );
}
