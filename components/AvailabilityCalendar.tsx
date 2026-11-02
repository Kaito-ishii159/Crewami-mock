"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  translate,
  type Locale,
  type StaffRecord,
  type TimeRange,
} from "@/lib/prototype";
import {
  dateLabel,
  monthDates,
  monthLabel,
  shiftMonth,
  validateRanges,
  type AvailabilityDay,
} from "@/lib/scheduling";
import type { SchedulingState } from "./useScheduling";
import {
  AvailabilityBulkEntry,
  AvailabilityTimeSelect,
} from "./AvailabilityBulkEntry";

function isAllDay(ranges: TimeRange[]) {
  return (
    ranges.length === 1 &&
    ranges[0].start === "00:00" &&
    ranges[0].end === "24:00"
  );
}

function DayEditor({
  date,
  initial,
  locale,
  onClose,
  onSave,
}: {
  date: string;
  initial?: AvailabilityDay;
  locale: Locale;
  onClose: () => void;
  onSave: (day: AvailabilityDay) => void;
}) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const [ranges, setRanges] = useState<TimeRange[]>(
    initial?.ranges.length
      ? initial.ranges.map((range) => ({ ...range }))
      : [{ start: "09:00", end: "13:00" }],
  );
  const dialogRef = useRef<HTMLElement>(null);
  const validation = validateRanges(ranges);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => previous?.focus();
  }, []);
  function update(index: number, key: keyof TimeRange, value: string) {
    setRanges((current) =>
      current.map((range, i) =>
        i === index ? { ...range, [key]: value } : range,
      ),
    );
  }
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section
        ref={dialogRef}
        tabIndex={-1}
        className="shift-editor-sheet availability-editor"
        role="dialog"
        aria-modal="true"
        aria-labelledby="availability-title"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
          if (event.key === "Tab") {
            const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
              "button:not(:disabled), input, select",
            );
            if (!focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div className="sheet-handle" />
        <div className="sheet-title-row">
          <div>
            <small>{tx("勤務できる時間", "WHEN YOU CAN WORK")}</small>
            <h3 id="availability-title">{dateLabel(date, locale)}</h3>
          </div>
          <button
            className="icon-button"
            aria-label={tx("閉じる", "Close")}
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        <p className="editor-hint">
          {tx(
            "この日だけ変更できます。時間は下から選んで、保存してください。",
            "Changes apply to this day only. Select the hours below, then save.",
          )}
        </p>
        <button
          className={`secondary-button day-all-time ${isAllDay(ranges) ? "is-all-day" : ""}`}
          onClick={() =>
            onSave({
              date,
              unavailable: false,
              ranges: [{ start: "00:00", end: "24:00" }],
            })
          }
        >
          {isAllDay(ranges) && <Check />}
          {tx("この日は全時間OK", "Any time on this day")}
        </button>
        {isAllDay(ranges) && (
          <p className="day-all-time-note">
            {tx(
              "全時間OK（時間指定なし）で登録されています。",
              "Available all day, with no time restriction.",
            )}
          </p>
        )}
        <div className="range-list">
          {ranges.map((range, index) => (
            <fieldset className="range-card" key={index}>
              <legend>
                {tx(`時間帯 ${index + 1}`, `Time range ${index + 1}`)}
              </legend>
              <div className="range-fields">
                <label>
                  <span>{tx("開始", "Start")}</span>
                  <AvailabilityTimeSelect
                    label={tx(
                      `時間帯${index + 1} 開始`,
                      `Range ${index + 1} start`,
                    )}
                    value={range.start}
                    onChange={(value) => update(index, "start", value)}
                  />
                </label>
                <span>—</span>
                <label>
                  <span>{tx("終了", "End")}</span>
                  <AvailabilityTimeSelect
                    label={tx(
                      `時間帯${index + 1} 終了`,
                      `Range ${index + 1} end`,
                    )}
                    value={range.end}
                    onChange={(value) => update(index, "end", value)}
                    end
                  />
                </label>
                <button
                  className="range-delete"
                  aria-label={tx(
                    `時間帯${index + 1}を削除`,
                    `Delete range ${index + 1}`,
                  )}
                  onClick={() =>
                    setRanges((current) =>
                      current.filter((_, i) => index !== i),
                    )
                  }
                >
                  <Trash2 />
                </button>
              </div>
            </fieldset>
          ))}
        </div>
        <button
          className="add-range-button"
          onClick={() =>
            setRanges((current) => [
              ...current,
              { start: "17:00", end: "22:00" },
            ])
          }
        >
          <Plus />
          {tx("時間帯を追加", "Add time range")}
        </button>
        {validation && (
          <p className="calendar-validation" role="alert">
            {validation === "overlap"
              ? tx("時間帯が重複しています。", "Time ranges overlap.")
              : tx(
                  "開始より後の終了時刻を入力してください（00:00〜24:00）。",
                  "Enter valid times with the end after the start (00:00–24:00).",
                )}
          </p>
        )}
        <button
          className="primary-button full-button"
          disabled={!!validation}
          onClick={() =>
            onSave({
              date,
              unavailable: false,
              ranges: [...ranges].sort((a, b) =>
                a.start.localeCompare(b.start),
              ),
            })
          }
        >
          <Check />
          {tx("この日の希望を保存", "Save this day")}
        </button>
        <button
          className="secondary-button full-button"
          onClick={() => onSave({ date, unavailable: true, ranges: [] })}
        >
          {tx("勤務不可", "Unavailable")}
        </button>
      </section>
    </div>
  );
}

export function AvailabilityCalendar({
  locale,
  person,
  scheduling,
  back,
}: {
  locale: Locale;
  person: StaffRecord;
  scheduling: SchedulingState;
  back: () => void;
}) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const [month, setMonth] = useState(scheduling.collectionMonth);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [submittedView, setSubmittedView] = useState(false);
  const [feedback, setFeedback] = useState("");
  const days = monthDates(month);
  const drafts = scheduling.availabilityByStaff[person.id] ?? {};
  const entered = days.filter((date) => drafts[date]).length;
  const submission = scheduling.submissions[person.id]?.[month];
  const monthDraft = Object.fromEntries(
    Object.entries(drafts).filter(([date]) => date.startsWith(month)),
  );
  const changed =
    !!submission &&
    JSON.stringify(monthDraft) !== JSON.stringify(submission.days);
  const weekdayLabels =
    locale === "ja"
      ? ["日", "月", "火", "水", "木", "金", "土"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const offset = days.length ? new Date(`${days[0]}T00:00:00Z`).getUTCDay() : 0;
  function changeMonth(offset: number) {
    setMonth((current) => shiftMonth(current, offset));
    setSubmittedView(false);
    setFeedback("");
  }
  return (
    <div className="screen calendar-screen">
      <div className="page-title">
        <button
          className="back-button"
          aria-label={tx("戻る", "Back")}
          onClick={back}
        >
          <ArrowLeft />
        </button>
        <div>
          <h2>{tx("自分のシフト希望", "My availability")}</h2>
          <p>
            {person[locale]} ·{" "}
            {person.role === "ADMIN"
              ? tx("管理者", "Admin")
              : tx("メンバー", "Member")}
          </p>
        </div>
        <CalendarDays />
      </div>
      <div className="calendar-month-bar">
        <button
          aria-label={tx("前月", "Previous month")}
          onClick={() => changeMonth(-1)}
        >
          <ChevronLeft />
        </button>
        <h3>{monthLabel(month, locale)}</h3>
        <button
          aria-label={tx("翌月", "Next month")}
          onClick={() => changeMonth(1)}
        >
          <ChevronRight />
        </button>
      </div>
      {month !== scheduling.collectionMonth && (
        <button
          className="return-collection-month"
          onClick={() => {
            setMonth(scheduling.collectionMonth);
            setFeedback("");
          }}
        >
          {tx("募集対象月へ戻る", "Return to collection month")}
        </button>
      )}
      {!submittedView && (
        <AvailabilityBulkEntry
          key={month}
          locale={locale}
          month={month}
          dayCount={days.length}
          hasEntries={entered > 0}
          onApply={(range) => {
            scheduling.saveDates(person.id, days, range);
            setFeedback(
              tx(
                `${days.length}日分を${range.start}〜${range.end}にしました。日付を押すと、その日だけ変更できます。`,
                `All ${days.length} days set to ${range.start}–${range.end}. Tap a date to change just that day.`,
              ),
            );
          }}
        />
      )}
      {feedback && !submittedView && (
        <p className="bulk-result" role="status">
          <Check aria-hidden="true" />
          {feedback}
        </p>
      )}
      <div className="calendar-progress">
        <span>
          <strong>
            {entered}
            <small>{tx("日", " days")}</small>
          </strong>
          {tx("入力済み", "Entered")}
        </span>
        <span>
          <strong>
            {days.length - entered}
            <small>{tx("日", " days")}</small>
          </strong>
          {tx("未入力", "Not entered")}
        </span>
        <p>
          {tx(
            "勤務しない日すべての入力は不要です。",
            "You do not need to fill every day.",
          )}
        </p>
      </div>
      {submittedView ? (
        <div className="calendar-submitted">
          <span className="success-orb">
            <Check />
          </span>
          <h3>{tx("提出済み ✓", "Submitted ✓")}</h3>
          <p>
            {monthLabel(month, locale)} · {person[locale]}
          </p>
          <p>
            {tx("最終更新", "Updated")}{" "}
            {submission &&
              new Date(submission.at).toLocaleString(
                locale === "ja" ? "ja-JP" : "en-US",
              )}
          </p>
          <button
            className="primary-button"
            onClick={() => setSubmittedView(false)}
          >
            {tx("希望を修正", "Edit availability")}
          </button>
          <button className="secondary-button full-button" onClick={back}>
            {tx("ホームへ戻る", "Back to home")}
          </button>
        </div>
      ) : (
        <>
          <div
            className="availability-calendar"
            role="group"
            aria-label={tx(
              "月間シフト希望カレンダー",
              "Monthly availability calendar",
            )}
          >
            <div className="calendar-weekdays">
              {weekdayLabels.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="calendar-grid">
              {Array.from({ length: offset }, (_, index) => (
                <span
                  className="calendar-empty"
                  key={`empty-${index}`}
                  aria-hidden="true"
                />
              ))}
              {days.map((date) => {
                const day = drafts[date];
                const allDay = isAllDay(day?.ranges ?? []);
                const number = Number(date.slice(-2));
                const summary = day?.unavailable
                  ? tx("勤務不可", "Unavailable")
                  : allDay
                    ? tx("全時間OK", "All day")
                    : day?.ranges.length
                      ? tx(
                          `${day.ranges.length}件`,
                          `${day.ranges.length} ranges`,
                        )
                      : tx("未入力", "Not entered");
                return (
                  <button
                    className={`calendar-day ${day?.unavailable ? "is-unavailable" : day?.ranges.length ? "has-ranges" : ""} ${allDay ? "is-all-day" : ""}`}
                    key={date}
                    aria-label={`${dateLabel(date, locale)} ${summary}`}
                    onClick={() => setEditingDate(date)}
                  >
                    <strong>{number}</strong>
                    {day?.unavailable ? (
                      <span className="calendar-day-status">
                        ×<small>{tx("不可", "Off")}</small>
                      </span>
                    ) : day?.ranges.length ? (
                      <>
                        <span className="calendar-day-status">
                          ● <small>{summary}</small>
                        </span>
                        {!allDay && (
                          <span className="calendar-range-summary">
                            {day.ranges.slice(0, 2).map((range, index) => (
                              <small key={index}>
                                {range.start.slice(0, 5)}–
                                {range.end.slice(0, 5)}
                              </small>
                            ))}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="calendar-unentered">○</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="calendar-legend">
            <span>● {tx("希望登録済み", "Entered")}</span>
            <span>× {tx("勤務不可", "Unavailable")}</span>
            <span>○ {tx("未入力", "Not entered")}</span>
          </div>
          <div className="calendar-submit-panel">
            {submission && (
              <p>
                {changed
                  ? tx("未提出の変更があります", "You have changes to submit")
                  : tx(
                      "提出済み ✓ 締切前は修正できます",
                      "Submitted ✓ You can edit before the deadline",
                    )}
              </p>
            )}
            <button
              className="primary-button"
              onClick={() => {
                scheduling.submitMonth(person.id, month);
                setSubmittedView(true);
              }}
            >
              {tx(
                `${Number(month.slice(5))}月の希望を${submission ? "再提出" : "提出"}`,
                submission
                  ? "Resubmit availability"
                  : "Submit month availability",
              )}
            </button>
          </div>
        </>
      )}
      {editingDate && (
        <DayEditor
          key={editingDate}
          date={editingDate}
          initial={drafts[editingDate]}
          locale={locale}
          onClose={() => setEditingDate(null)}
          onSave={(day) => {
            scheduling.saveDay(person.id, day);
            setEditingDate(null);
            setFeedback(
              tx(
                `${dateLabel(day.date, locale)}を${day.unavailable ? "勤務不可" : isAllDay(day.ranges) ? "全時間OK" : "指定した時間"}にしました。他の日の希望はそのままです。`,
                `Updated ${dateLabel(day.date, locale)}. Other days are unchanged.`,
              ),
            );
          }}
        />
      )}
    </div>
  );
}
