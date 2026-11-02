"use client";

import { useEffect, useRef, useState } from "react";
import { translate, type Locale, type TimeRange } from "@/lib/prototype";
import { monthLabel, validateRanges } from "@/lib/scheduling";

const timeOptions = Array.from(
  { length: 49 },
  (_, index) =>
    `${String(Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`,
);

export function AvailabilityTimeSelect({
  label,
  value,
  onChange,
  end = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  end?: boolean;
}) {
  const options = end ? timeOptions.slice(1) : timeOptions.slice(0, -1);
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {!options.includes(value) && <option value={value}>{value}</option>}
      {options.map((time) => (
        <option key={time} value={time}>
          {time}
        </option>
      ))}
    </select>
  );
}

export function AvailabilityBulkEntry({
  locale,
  month,
  dayCount,
  hasEntries,
  onApply,
}: {
  locale: Locale;
  month: string;
  dayCount: number;
  hasEntries: boolean;
  onApply: (range: TimeRange) => void;
}) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("18:00");
  const [pending, setPending] = useState<TimeRange | null>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const valid = !validateRanges([{ start, end }]);
  useEffect(() => {
    if (pending) confirmationRef.current?.focus();
    else triggerRef.current?.focus();
  }, [pending]);

  function request(range: TimeRange, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    if (hasEntries) setPending(range);
    else onApply(range);
  }
  function cancel() {
    setPending(null);
  }

  return (
    <section
      className="availability-bulk"
      aria-label={tx("時間帯を一括設定", "Set hours for all days")}
    >
      <h3>{tx("時間帯を一括設定", "Set hours for all days")}</h3>
      <p>
        {tx(
          `${monthLabel(month, locale)}の${dayCount}日分に、同じ時間帯を設定できます。`,
          `Set the same hours for all ${dayCount} days in ${monthLabel(month, locale)}.`,
        )}
      </p>
      <div className="bulk-time-settings">
        <div className="bulk-time-fields">
          <label>
            <span>{tx("開始時間", "Start time")}</span>
            <AvailabilityTimeSelect
              label={tx("一括設定 開始時間", "Bulk start time")}
              value={start}
              onChange={setStart}
            />
          </label>
          <label>
            <span>{tx("終了時間", "End time")}</span>
            <AvailabilityTimeSelect
              label={tx("一括設定 終了時間", "Bulk end time")}
              value={end}
              onChange={setEnd}
              end
            />
          </label>
        </div>
        {!valid && (
          <p className="calendar-validation" role="alert">
            {tx(
              "終了時間は開始時間より後を選んでください。",
              "Choose an end time after the start time.",
            )}
          </p>
        )}
        <button
          className="primary-button"
          disabled={!valid || !!pending}
          onClick={(event) => request({ start, end }, event.currentTarget)}
        >
          {tx("全日程に適用", "Apply to all days")}
        </button>
      </div>
      <p className="bulk-help">
        {tx(
          "入力済みの希望は上書きされます。設定後に、日付を押してその日だけ変更できます。",
          "This replaces existing entries. Afterwards, tap any date to change just that day.",
        )}
      </p>
      {pending && (
        <div
          className="bulk-confirmation"
          ref={confirmationRef}
          tabIndex={-1}
          role="group"
          aria-label={tx("一括設定の確認", "Confirm replacement")}
          onKeyDown={(event) => {
            if (event.key === "Escape") cancel();
          }}
        >
          <p role="alert">
            <strong>
              {tx(
                `${dayCount}日分を${pending.start}〜${pending.end}に変更しますか？`,
                `Replace all ${dayCount} days with ${pending.start}–${pending.end}?`,
              )}
            </strong>
          </p>
          <p>
            {tx(
              "勤務不可の日や、個別に変更した時間も上書きされます。",
              "Unavailable days and individually edited times will also be replaced.",
            )}
          </p>
          <button
            className="primary-button"
            onClick={() => {
              onApply(pending);
              setPending(null);
            }}
          >
            {tx("上書きして設定", "Replace existing entries")}
          </button>
          <button className="secondary-button" onClick={cancel}>
            {tx("やめる", "Cancel")}
          </button>
        </div>
      )}
    </section>
  );
}
