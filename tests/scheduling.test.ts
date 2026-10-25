import assert from "node:assert/strict";
import test from "node:test";
import { accountOf, findStoreAccount } from "../lib/accounts";
import {
  initialStaff,
  initialStores,
  getEffectiveFeatures,
  getPlanEntitlements,
  defaultAdminEnabledFeatures,
} from "../lib/prototype";
import {
  availabilityExportRows,
  generateShiftMonth,
  monthDates,
  shiftMonth,
  validateRanges,
  type Submissions,
} from "../lib/scheduling";

test("month navigation includes the entire month and handles leap years", () => {
  assert.equal(monthDates("2026-11").length, 30);
  assert.equal(monthDates("2026-12").at(-1), "2026-12-31");
  assert.equal(monthDates("2026-02").length, 28);
  assert.equal(monthDates("2028-02").at(-1), "2028-02-29");
  assert.equal(shiftMonth("2026-12", 1), "2027-01");
  assert.equal(shiftMonth("2026-01", -1), "2025-12");
  assert.deepEqual(monthDates("2026-13"), []);
});

test("split shifts allow adjacent ranges and midnight, but reject invalid or overlapping times", () => {
  assert.equal(
    validateRanges([
      { start: "09:00", end: "13:00" },
      { start: "17:00", end: "22:00" },
    ]),
    null,
  );
  assert.equal(
    validateRanges([
      { start: "12:00", end: "15:00" },
      { start: "09:00", end: "13:00" },
    ]),
    "overlap",
  );
  assert.equal(
    validateRanges([
      { start: "09:00", end: "13:00" },
      { start: "13:00", end: "24:00" },
    ]),
    null,
  );
  for (const ranges of [
    [],
    [{ start: "13:00", end: "09:00" }],
    [{ start: "09:00", end: "09:00" }],
    [{ start: "24:00", end: "24:00" }],
    [{ start: "09:60", end: "13:00" }],
    [{ start: "9:00", end: "13:00" }],
  ])
    assert.equal(validateRanges(ranges), "invalid");
});

test("the same email identifies different internal accounts for different Store IDs", () => {
  const shibuya = findStoreAccount(
    initialStores,
    initialStaff,
    "SHIBUYA01",
    "member@example.com",
  )!;
  const shinjuku = findStoreAccount(
    initialStores,
    initialStaff,
    " shinjuku01 ",
    "MEMBER@example.com",
  )!;
  assert.notEqual(shibuya.id, shinjuku.id);
  assert.equal(accountOf(shibuya).storeId, "shibuya");
  assert.equal(accountOf(shinjuku).storeId, "shinjuku");
  assert.equal(
    findStoreAccount(
      initialStores,
      initialStaff,
      "SHINJUKU01",
      "admin@example.com",
    ),
    undefined,
  );
  assert.equal(
    findStoreAccount(
      initialStores,
      initialStaff,
      "UNKNOWN",
      "member@example.com",
    ),
    undefined,
  );
});

test("submitted ranges, admin staff and confirmed overrides survive month navigation and export", () => {
  const staff = initialStaff.filter((person) => person.storeId === "shibuya");
  const date = "2026-11-10";
  const ranges = [
    { start: "09:00", end: "13:00" },
    { start: "17:00", end: "22:00" },
  ];
  const submissions: Submissions = {
    tanaka: {
      "2026-11": {
        at: "2026-10-18T10:00:00Z",
        days: { [date]: { date, unavailable: false, ranges } },
      },
    },
    yamada: {
      "2026-11": {
        at: "2026-10-18T10:00:00Z",
        days: {
          [date]: {
            date,
            unavailable: false,
            ranges: [{ start: "10:00", end: "16:00" }],
          },
        },
      },
    },
  };
  const confirmations = {
    [date]: { tanaka: undefined, yamada: { start: "10:00", end: "15:00" } },
  };
  const november = generateShiftMonth(
    "2026-11",
    staff,
    submissions,
    confirmations,
  );
  assert.equal(november.length, 30);
  const row = november[9].rows.find((row) => row.staffId === "tanaka")!;
  assert.deepEqual(row.availabilityRanges, ranges);
  assert.equal(row.confirmed, undefined);
  assert.deepEqual(
    november[9].rows.find((row) => row.staffId === "yamada")?.confirmed,
    { start: "10:00", end: "15:00" },
  );
  assert.equal(
    generateShiftMonth("2026-12", staff, submissions, confirmations).length,
    31,
  );
  assert.deepEqual(
    generateShiftMonth("2026-11", staff, submissions, confirmations)[9].rows,
    november[9].rows,
  );
  const rows = availabilityExportRows(staff, "2026-11", submissions);
  assert.equal(
    rows.filter((row) => row[1] === "member@example.com" && row[2] === date)
      .length,
    2,
  );
  assert.deepEqual(availabilityExportRows(staff, "2026-12", submissions), []);
  assert.equal(
    availabilityExportRows(
      initialStaff.filter((person) => person.storeId === "shinjuku"),
      "2026-11",
      submissions,
    ).length,
    0,
  );
});

test("unavailable days clear bars, drafts do not leak, and collection plan retains calendar access only", () => {
  const date = "2026-11-10";
  const submissions: Submissions = {
    tanaka: {
      "2026-11": {
        at: "2026-10-18T10:00:00Z",
        days: { [date]: { date, unavailable: true, ranges: [] } },
      },
    },
  };
  const row = generateShiftMonth(
    "2026-11",
    initialStaff,
    submissions,
    {},
  )[9].rows.find((row) => row.staffId === "tanaka")!;
  assert.deepEqual(row.availabilityRanges, []);
  const admin = generateShiftMonth(
    "2026-11",
    initialStaff,
    submissions,
    {},
  )[9].rows.find((row) => row.staffId === "yamada")!;
  assert.deepEqual(admin.availabilityRanges, []);
  const features = getEffectiveFeatures(
    getPlanEntitlements("active", "COLLECTION"),
    defaultAdminEnabledFeatures,
  );
  assert.equal(features.SHIFT_COLLECTION, true);
  assert.equal(features.SCHEDULE, false);
  assert.equal(
    getEffectiveFeatures(getPlanEntitlements("trial", null), {
      ...defaultAdminEnabledFeatures,
      SHIFT_COLLECTION: false,
    }).SHIFT_COLLECTION,
    false,
  );
});
