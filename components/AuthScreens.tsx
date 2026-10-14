'use client';

import { useState, type FormEvent } from 'react';
import { ArrowLeft, Check, LockKeyhole, Mail } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { translate, type Locale, type Role, type Screen } from '@/lib/prototype';

type AuthScreensProps = {
  locale: Locale;
  screen: Screen;
  navigate: (screen: Screen) => void;
  onLogin: (role: Role) => void;
};

function AuthHeader({ locale, title, subtitle }: { locale: Locale; title: string; subtitle: string }) {
  return <div className="auth-heading" lang={locale}><BrandMark /><span>Crewami</span><h1>{title}</h1><p>{subtitle}</p></div>;
}

export function AuthScreens({ locale, screen, navigate, onLogin }: AuthScreensProps) {
  const tx = (ja: string, en: string) => translate(locale, ja, en);
  const [email, setEmail] = useState(screen === 'inviteSetPassword' ? 'tanaka@example.com' : 'admin@example.com');
  const [password, setPassword] = useState('crewami-demo');
  const [confirmation, setConfirmation] = useState('');
  const [sent, setSent] = useState(false);
  const [complete, setComplete] = useState(false);

  if (screen === 'forgotPassword') {
    return <div className="auth-screen"><button className="back-button auth-back" onClick={() => navigate('login')} aria-label={tx('戻る', 'Back')}><ArrowLeft /></button><AuthHeader locale={locale} title={tx('パスワードをお忘れですか？', 'Forgot your password?')} subtitle={tx('ログイン用メールアドレスへ再設定リンクを送ります。', 'We’ll send a reset link to your login email.')} />{sent ? <div className="auth-success"><span><Check /></span><h2>{tx('再設定メールを送信しました', 'Reset email sent')}</h2><p>{email}</p><button className="primary-button" onClick={() => navigate('passwordReset')}>{tx('再設定画面を確認', 'Preview reset screen')}</button></div> : <form className="auth-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><label><span>{tx('メールアドレス', 'Email')}</span><div><Mail /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div></label><button className="primary-button" type="submit">{tx('再設定メールを送信', 'Send reset email')}</button></form>}</div>;
  }

  if (screen === 'passwordReset' || screen === 'inviteSetPassword') {
    const invited = screen === 'inviteSetPassword';
    return <div className="auth-screen"><button className="back-button auth-back" onClick={() => navigate('login')} aria-label={tx('戻る', 'Back')}><ArrowLeft /></button><AuthHeader locale={locale} title={invited ? tx('Crewamiへようこそ', 'Welcome to Crewami') : tx('新しいパスワード', 'Create a new password')} subtitle={invited ? tx('田中 太郎さん、ログイン用パスワードを設定してください。', 'Taro Tanaka, set your login password.') : tx('新しいログインパスワードを入力してください。', 'Enter your new login password.')} />{complete ? <div className="auth-success"><span><Check /></span><h2>{tx('設定完了', 'Password set')}</h2><p>{tx('新しいパスワードでログインできます。', 'You can now sign in with your new password.')}</p><button className="primary-button" onClick={() => navigate('login')}>{tx('ログインへ', 'Go to login')}</button></div> : <form className="auth-form" onSubmit={(event) => { event.preventDefault(); if (password === confirmation) setComplete(true); }}><label><span>{tx('新しいパスワード', 'New password')}</span><div><LockKeyhole /><input type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></div></label><label><span>{tx('確認', 'Confirm password')}</span><div><LockKeyhole /><input type="password" minLength={8} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></div></label>{confirmation && password !== confirmation && <p className="form-error">{tx('パスワードが一致しません。', 'Passwords do not match.')}</p>}<button className="primary-button" type="submit" disabled={!confirmation || password !== confirmation}>{tx('パスワードを設定', 'Set password')}</button></form>}</div>;
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    onLogin(email.toLowerCase().startsWith('member') ? 'MEMBER' : 'ADMIN');
  }

  return <div className="auth-screen"><AuthHeader locale={locale} title={tx('チームの毎日を、ひとつに。', 'Your team, in one place.')} subtitle={tx('シフト・勤怠・チーム連携をかんたんに。', 'Schedules, attendance, and teamwork made simple.')} /><form className="auth-form" onSubmit={submit}><label><span>{tx('メールアドレス', 'Email')}</span><div><Mail /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div></label><label><span>{tx('パスワード', 'Password')}</span><div><LockKeyhole /><input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></div></label><button className="primary-button" type="submit">{tx('ログイン', 'Log in')}</button></form><button className="auth-link" onClick={() => navigate('forgotPassword')}>{tx('パスワードを忘れた方はこちら', 'Forgot password?')}</button><div className="demo-accounts"><strong>{tx('モックアカウント', 'Mock accounts')}</strong><button onClick={() => setEmail('admin@example.com')}>ADMIN · admin@example.com</button><button onClick={() => setEmail('member@example.com')}>MEMBER · member@example.com</button><button onClick={() => navigate('inviteSetPassword')}>{tx('招待メールからの初回設定を確認', 'Preview invitation setup')}</button></div></div>;
}
