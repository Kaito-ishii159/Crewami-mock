import type { Role, StaffRecord, StoreRecord } from "./prototype";

export interface LoginCredentials {
  storeCode: string;
  email: string;
  password: string;
}
export interface AuthenticatedAccount {
  staffId: string;
  storeId: string;
  email: string;
  role: Role;
}
export interface WorkspaceInput {
  storeName: string;
  adminName: string;
  email: string;
  password: string;
}
export interface WorkspaceResult {
  store: StoreRecord;
  admin: StaffRecord;
}

export function findStoreAccount(
  stores: StoreRecord[],
  staff: StaffRecord[],
  storeCode: string,
  email: string,
) {
  const store = stores.find(
    (item) => item.code === storeCode.trim().toUpperCase(),
  );
  return store
    ? staff.find(
        (person) =>
          person.storeId === store.id &&
          person.email.toLowerCase() === email.trim().toLowerCase() &&
          person.status !== "DISABLED",
      )
    : undefined;
}

export function accountOf(person: StaffRecord): AuthenticatedAccount {
  return {
    staffId: person.id,
    storeId: person.storeId,
    email: person.email,
    role: person.role,
  };
}

export function createStoreCode(stores: StoreRecord[]) {
  let code: string;
  do {
    code = `CRW-${crypto.randomUUID().replaceAll("-", "").slice(0, 5).toUpperCase()}`;
  } while (stores.some((store) => store.code === code));
  return code;
}
