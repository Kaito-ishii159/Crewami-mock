"use client";

import {
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Copy,
  LockKeyhole,
  Mail,
  Plus,
  Store,
  UserRound,
} from "lucide-react";
import { BrandMark } from "./BrandMark";
import {
  translate,
  type Locale,
  type Screen,
  type StaffRecord,
  type StoreRecord,
} from "@/lib/prototype";
import {
  findStoreAccount,
  type LoginCredentials,
  type WorkspaceInput,
  type WorkspaceResult,
} from "@/lib/accounts";

type Props = {
  locale: Locale;
  screen: Screen;
  navigate: (screen: Screen) => void;
  stores: StoreRecord[];
  staff: StaffRecord[];
  credentials: LoginCredentials;
  setCredentials: Dispatch<SetStateAction<LoginCredentials>>;
  onLogin: (credentials: LoginCredentials) => boolean;
  onPasswordSet: (staffId: string, password: string) => void;
  inviteStaffId: string;
  onCreateWorkspace: (input: WorkspaceInput) => void;
  workspaceResult: WorkspaceResult | null;
  openWorkspace: () => void;
};

function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="auth-heading">
      <BrandMark />
      <span>Crewami</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}

export function AuthScreens(p: Props) {
  const {
    locale,
    screen,
    navigate,
    stores,
    staff,
    credentials,
    setCredentials,
  } = p;
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [sent, setSent] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const back = (
    <button
      className="back-button auth-back"
      onClick={() => navigate("login")}
      aria-label={tx("戻る", "Back")}
    >
      <ArrowLeft />
    </button>
  );
  const storeField = (
    <label>
      <span>{tx("店舗ID", "Store ID")}</span>
      <div>
        <Store />
        <input
          required
          autoCapitalize="characters"
          autoComplete="off"
          value={credentials.storeCode}
          onChange={(event) =>
            setCredentials((current) => ({
              ...current,
              storeCode: event.target.value.toUpperCase(),
            }))
          }
          placeholder="SHIBUYA01"
        />
      </div>
    </label>
  );
  const emailField = (
    <label>
      <span>{tx("メールアドレス", "Email")}</span>
      <div>
        <Mail />
        <input
          type="email"
          required
          autoComplete="username"
          value={credentials.email}
          onChange={(event) =>
            setCredentials((current) => ({
              ...current,
              email: event.target.value,
            }))
          }
        />
      </div>
    </label>
  );
  const passwordFields = (
    <>
      <label>
        <span>{tx("新しいパスワード", "New password")}</span>
        <div>
          <LockKeyhole />
          <input
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </label>
      <label>
        <span>{tx("パスワード確認", "Confirm password")}</span>
        <div>
          <LockKeyhole />
          <input
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
          />
        </div>
      </label>
      {confirmation && confirmation !== password && (
        <p className="form-error" role="alert">
          {tx("パスワードが一致しません。", "Passwords do not match.")}
        </p>
      )}
    </>
  );
  const validPassword = password.length >= 8 && password === confirmation;

  if (screen === "workspaceNotice")
    return (
      <div className="auth-screen workspace-auth">
        {back}
        <AuthHeader
          title={tx("新しくシフト管理表を作成", "Create a shift workspace")}
          subtitle={tx(
            "初めてCrewamiを導入する店舗の方へ",
            "For stores introducing Crewami for the first time",
          )}
        />
        <section className="workspace-warning">
          <AlertTriangle />
          <h2>
            {tx("店舗の管理者・店長向け", "For store owners and managers")}
          </h2>
          <p>
            {tx(
              "この操作は、新しくCrewamiを導入する店舗の管理者向けです。",
              "This creates a new workspace for a store introducing Crewami.",
            )}
          </p>
          <strong>
            {tx(
              "すでに勤務先から招待されているスタッフは、新しい管理表を作成しないでください。",
              "Invited staff: do not create a new workspace.",
            )}
          </strong>
          <p>
            {tx(
              "スタッフの方は、勤務先から案内された店舗IDとメールアドレスでログインしてください。",
              "Staff should sign in using the Store ID and email provided by their workplace.",
            )}
          </p>
        </section>
        <button
          className="primary-button"
          onClick={() => navigate("workspaceCreate")}
        >
          {tx("店舗の管理者として新しく作成", "Create as a store manager")}
        </button>
        <button
          className="secondary-button full-button"
          onClick={() => navigate("login")}
        >
          {tx("ログインへ戻る", "Return to login")}
        </button>
      </div>
    );

  if (screen === "workspaceCreate")
    return (
      <div className="auth-screen workspace-auth">
        {back}
        <AuthHeader
          title={tx("シフト管理表を作成", "Create your workspace")}
          subtitle={tx(
            "お店と管理者の情報を登録してください。",
            "Enter your store and administrator details.",
          )}
        />
        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (validPassword)
              p.onCreateWorkspace({
                storeName: storeName.trim(),
                adminName: adminName.trim(),
                email: newEmail.trim(),
                password,
              });
          }}
        >
          <label>
            <span>{tx("店舗名", "Store name")}</span>
            <div>
              <Store />
              <input
                required
                value={storeName}
                onChange={(event) => setStoreName(event.target.value)}
              />
            </div>
          </label>
          <label>
            <span>{tx("管理者名", "Administrator name")}</span>
            <div>
              <UserRound />
              <input
                required
                value={adminName}
                onChange={(event) => setAdminName(event.target.value)}
              />
            </div>
          </label>
          <label>
            <span>{tx("メールアドレス", "Email")}</span>
            <div>
              <Mail />
              <input
                type="email"
                required
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
              />
            </div>
          </label>
          {passwordFields}
          <p className="trial-note">
            {tx(
              "最初の1か月間は、全機能を無料でお試しいただけます。",
              "Enjoy all features free for your first month.",
            )}
          </p>
          <button
            className="primary-button"
            type="submit"
            disabled={!validPassword || !storeName.trim() || !adminName.trim()}
          >
            {tx("シフト管理表を作成", "Create workspace")}
          </button>
        </form>
      </div>
    );

  if (screen === "workspaceComplete" && p.workspaceResult)
    return (
      <div className="auth-screen workspace-auth">
        <AuthHeader
          title={tx("シフト管理表を作成しました", "Your workspace is ready")}
          subtitle={p.workspaceResult.store[locale]}
        />
        <div className="workspace-code">
          <span className="success-orb">
            <Check />
          </span>
          <small>{tx("店舗ID", "STORE ID")}</small>
          <strong>{p.workspaceResult.store.code}</strong>
          <p>
            {tx(
              "スタッフがログインする際に、この店舗IDが必要です。",
              "Your staff will need this Store ID to sign in.",
            )}
          </p>
          <button
            className="secondary-button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  p.workspaceResult!.store.code,
                );
                setCopied(true);
              } catch {
                setError(
                  tx(
                    "店舗IDを長押ししてコピーしてください。",
                    "Select and copy the Store ID.",
                  ),
                );
              }
            }}
          >
            <Copy />
            {copied
              ? tx("コピーしました", "Copied")
              : tx("店舗IDをコピー", "Copy Store ID")}
          </button>
          {error && <p role="status">{error}</p>}
        </div>
        <button
          className="primary-button full-button"
          onClick={p.openWorkspace}
        >
          {tx("管理画面を開く", "Open management")}
        </button>
        <p className="trial-note">
          {tx(
            "1か月無料体験中 · 全機能利用可能",
            "One-month free trial · All features",
          )}
        </p>
      </div>
    );

  if (screen === "forgotPassword")
    return (
      <div className="auth-screen">
        {back}
        <AuthHeader
          title={tx("パスワードをお忘れですか？", "Forgot your password?")}
          subtitle={tx(
            "店舗IDとメールアドレスを入力してください。",
            "Enter your Store ID and email address.",
          )}
        />
        {sent ? (
          <div className="auth-success">
            <span>
              <Check />
            </span>
            <h2>{tx("再設定メールを送信しました", "Reset email sent")}</h2>
            <p>
              {credentials.storeCode} · {credentials.email}
            </p>
            <button
              className="primary-button"
              onClick={() => navigate("passwordReset")}
            >
              {tx("再設定画面を確認", "Preview reset screen")}
            </button>
          </div>
        ) : (
          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (
                !findStoreAccount(
                  stores,
                  staff,
                  credentials.storeCode,
                  credentials.email,
                )
              ) {
                setError(
                  tx(
                    "店舗IDとメールアドレスの組み合わせを確認してください。",
                    "Check the Store ID and email combination.",
                  ),
                );
                return;
              }
              setSent(true);
            }}
          >
            {storeField}
            {emailField}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="primary-button" type="submit">
              {tx("再設定メールを送信", "Send reset email")}
            </button>
          </form>
        )}
      </div>
    );

  if (screen === "passwordReset" || screen === "inviteSetPassword") {
    const invited = screen === "inviteSetPassword";
    const person = invited
      ? staff.find((item) => item.id === p.inviteStaffId)
      : findStoreAccount(
          stores,
          staff,
          credentials.storeCode,
          credentials.email,
        );
    const store = stores.find((item) => item.id === person?.storeId);
    return (
      <div className="auth-screen">
        {back}
        <AuthHeader
          title={
            invited
              ? tx("Crewamiへようこそ", "Welcome to Crewami")
              : tx("新しいパスワード", "Create a new password")
          }
          subtitle={tx(
            "ログイン用パスワードを設定してください。",
            "Set your login password.",
          )}
        />
        <div className="invitation-context">
          <strong>{store?.[locale]}</strong>
          <span>
            {person?.[locale]}
            {tx("さん", "")}
          </span>
        </div>
        {complete ? (
          <div className="auth-success">
            <span>
              <Check />
            </span>
            <h2>{tx("設定完了", "Password set")}</h2>
            <dl className="login-details">
              <dt>{tx("店舗ID", "Store ID")}</dt>
              <dd>{store?.code}</dd>
              <dt>{tx("メールアドレス", "Email")}</dt>
              <dd>{person?.email}</dd>
            </dl>
            <button
              className="primary-button"
              onClick={() => {
                setCredentials({
                  storeCode: store?.code ?? "",
                  email: person?.email ?? "",
                  password,
                });
                navigate("login");
              }}
            >
              {tx("ログインへ", "Go to login")}
            </button>
          </div>
        ) : (
          <form
            className="auth-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (validPassword && person) {
                p.onPasswordSet(person.id, password);
                setComplete(true);
              }
            }}
          >
            {passwordFields}
            <button
              className="primary-button"
              type="submit"
              disabled={!validPassword || !person}
            >
              {tx("パスワードを設定", "Set password")}
            </button>
          </form>
        )}
      </div>
    );
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!p.onLogin(credentials))
      setError(
        tx(
          "店舗ID・メールアドレス・パスワードを確認してください。招待中の方は先にパスワードを設定してください。",
          "Check your Store ID, email and password. Invited staff must first set a password.",
        ),
      );
  }
  return (
    <div className="auth-screen login-screen">
      <AuthHeader
        title={tx("チームの毎日を、ひとつに。", "Your team, in one place.")}
        subtitle={tx(
          "勤務先から案内された情報でログイン",
          "Sign in with the details from your workplace",
        )}
      />
      <form className="auth-form" onSubmit={submit}>
        {storeField}
        {emailField}
        <label>
          <span>{tx("パスワード", "Password")}</span>
          <div>
            <LockKeyhole />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={credentials.password}
              onChange={(event) =>
                setCredentials((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
            />
          </div>
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary-button" type="submit">
          {tx("ログイン", "Log in")}
        </button>
      </form>
      <button className="auth-link" onClick={() => navigate("forgotPassword")}>
        {tx("パスワードを忘れた方はこちら", "Forgot password?")}
      </button>
      <section className="workspace-entry">
        <p>
          {tx(
            "初めてCrewamiを導入する方",
            "Introducing Crewami to your store?",
          )}
        </p>
        <button
          className="secondary-button"
          onClick={() => navigate("workspaceNotice")}
        >
          <Plus />
          {tx("新しくシフト管理表を作成", "Create a new shift workspace")}
        </button>
      </section>
      <details className="demo-accounts">
        <summary>{tx("デモアカウントを選ぶ", "Choose a demo account")}</summary>
        {[
          ["SHIBUYA01", "admin@example.com", "ADMIN"],
          ["SHIBUYA01", "member@example.com", "MEMBER"],
          ["SHINJUKU01", "member@example.com", "MEMBER"],
        ].map(([storeCode, email, role]) => (
          <button
            key={`${storeCode}-${email}`}
            onClick={() => {
              setCredentials({ storeCode, email, password: "crewami-demo" });
              setError("");
            }}
          >
            <strong>
              {storeCode} · {role}
            </strong>
            <span>{email}</span>
          </button>
        ))}
        <button onClick={() => navigate("inviteSetPassword")}>
          {tx("招待メールからの初回設定を確認", "Preview invitation setup")}
        </button>
      </details>
    </div>
  );
}
