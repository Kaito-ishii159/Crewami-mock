"use client";

import { useMemo, useState } from "react";
import {
  generateShiftMonth,
  initialAvailability,
  initialSubmissions,
  type AvailabilityDay,
  type Confirmations,
} from "@/lib/scheduling";
import type { StaffRecord, TimeRange } from "@/lib/prototype";

export function useScheduling(staff: StaffRecord[]) {
  const [availabilityByStaff, setAvailabilityByStaff] =
    useState(initialAvailability);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [confirmations, setConfirmations] = useState<Confirmations>({});
  const [collectionMonth, setCollectionMonth] = useState("2026-11");
  const [deadline, setDeadline] = useState("2026-10-25");
  const [selectedScheduleMonth, setSelectedScheduleMonth] = useState("2026-11");
  const [selectedScheduleDate, setSelectedScheduleDate] =
    useState("2026-11-10");
  const days = useMemo(
    () =>
      generateShiftMonth(
        selectedScheduleMonth,
        staff,
        submissions,
        confirmations,
      ),
    [selectedScheduleMonth, staff, submissions, confirmations],
  );
  const exportDays = useMemo(
    () =>
      generateShiftMonth(collectionMonth, staff, submissions, confirmations),
    [collectionMonth, staff, submissions, confirmations],
  );

  function saveDay(staffId: string, day: AvailabilityDay) {
    setAvailabilityByStaff((current) => ({
      ...current,
      [staffId]: { ...current[staffId], [day.date]: day },
    }));
  }
  function submitMonth(staffId: string, month: string) {
    const days = Object.fromEntries(
      Object.entries(availabilityByStaff[staffId] ?? {}).filter(([date]) =>
        date.startsWith(month),
      ),
    );
    setSubmissions((current) => ({
      ...current,
      [staffId]: {
        ...current[staffId],
        [month]: { at: new Date().toISOString(), days },
      },
    }));
  }
  function confirmShift(date: string, staffId: string, range?: TimeRange) {
    setConfirmations((current) => ({
      ...current,
      [date]: { ...current[date], [staffId]: range },
    }));
  }
  function changeScheduleMonth(month: string) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return;
    setSelectedScheduleMonth(month);
    setSelectedScheduleDate(`${month}-01`);
  }
  return {
    availabilityByStaff,
    submissions,
    collectionMonth,
    setCollectionMonth,
    deadline,
    setDeadline,
    selectedScheduleMonth,
    selectedScheduleDate,
    setSelectedScheduleDate,
    changeScheduleMonth,
    days,
    exportDays,
    saveDay,
    submitMonth,
    confirmShift,
  };
}
export type SchedulingState = ReturnType<typeof useScheduling>;
