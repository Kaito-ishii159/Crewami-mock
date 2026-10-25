import {
  initialShiftDays,
  type Locale,
  type ShiftDay,
  type StaffRecord,
  type TimeRange,
} from "./prototype";

export interface AvailabilityDay {
  date: string;
  unavailable: boolean;
  ranges: TimeRange[];
}
export type AvailabilityByStaff = Record<
  string,
  Record<string, AvailabilityDay>
>;
export type Submissions = Record<
  string,
  Record<string, { at: string; days: Record<string, AvailabilityDay> }>
>;
export type Confirmations = Record<
  string,
  Record<string, TimeRange | undefined>
>;

export function monthDates(month: string): string[] {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return [];
  const [year, number] = month.split("-").map(Number);
  return Array.from(
    { length: new Date(Date.UTC(year, number, 0)).getUTCDate() },
    (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`,
  );
}

export function shiftMonth(month: string, offset: number): string {
  const [year, number] = month.split("-").map(Number);
  return new Date(Date.UTC(year, number - 1 + offset, 1))
    .toISOString()
    .slice(0, 7);
}

export function dateLabel(
  date: string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    weekday: "short",
  },
) {
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    ...options,
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function monthLabel(month: string, locale: Locale) {
  return dateLabel(`${month}-01`, locale, { year: "numeric", month: "long" });
}

export function validateRanges(
  ranges: TimeRange[],
): "invalid" | "overlap" | null {
  if (
    !ranges.length ||
    ranges.some(
      ({ start, end }) =>
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(start) ||
        !/^([01]\d|2[0-3]):[0-5]\d$|^24:00$/.test(end) ||
        start >= end,
    )
  )
    return "invalid";
  const sorted = [...ranges].sort((a, b) => a.start.localeCompare(b.start));
  return sorted.some(
    (range, index) => index > 0 && range.start < sorted[index - 1].end,
  )
    ? "overlap"
    : null;
}

export function initialAvailability(): AvailabilityByStaff {
  const result: AvailabilityByStaff = {};
  for (const day of initialShiftDays)
    for (const row of day.rows) {
      if (row.availabilityRanges.length)
        (result[row.staffId] ??= {})[day.id] = {
          date: day.id,
          unavailable: false,
          ranges: row.availabilityRanges,
        };
    }
  result["tanaka-shinjuku"] = {
    "2026-11-10": {
      date: "2026-11-10",
      unavailable: false,
      ranges: [{ start: "12:00", end: "20:00" }],
    },
  };
  return result;
}

export function initialSubmissions(): Submissions {
  const drafts = initialAvailability();
  return Object.fromEntries(
    ["sato", "takahashi"].map((id) => [
      id,
      { "2026-11": { at: "2026-10-18T11:12:00.000Z", days: drafts[id] ?? {} } },
    ]),
  );
}

export function generateShiftMonth(
  month: string,
  staff: StaffRecord[],
  submissions: Submissions,
  confirmations: Confirmations,
): ShiftDay[] {
  return monthDates(month).map((date) => ({
    id: date,
    ja: dateLabel(date, "ja"),
    en: dateLabel(date, "en"),
    rows: staff
      .filter((person) => person.status !== "DISABLED")
      .map((person) => {
        const seed = initialShiftDays
          .find((day) => day.id === date)
          ?.rows.find((row) => row.staffId === person.id);
        const availability = submissions[person.id]?.[month]?.days[date];
        const overrides = confirmations[date];
        return {
          staffId: person.id,
          availabilityRanges: availability?.unavailable
            ? []
            : (availability?.ranges ?? []),
          confirmed:
            overrides && Object.hasOwn(overrides, person.id)
              ? overrides[person.id]
              : seed?.confirmed,
        };
      }),
  }));
}

export function availabilityExportRows(
  staff: StaffRecord[],
  month: string,
  submissions: Submissions,
): string[][] {
  return staff.flatMap((person) =>
    Object.values(submissions[person.id]?.[month]?.days ?? {})
      .sort((a, b) => a.date.localeCompare(b.date))
      .flatMap((day) =>
        day.unavailable
          ? [[person.ja, person.email, day.date, "勤務不可", "", ""]]
          : day.ranges.map((range) => [
              person.ja,
              person.email,
              day.date,
              "勤務可能",
              range.start,
              range.end,
            ]),
      ),
  );
}
