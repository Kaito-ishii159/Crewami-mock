import type { Metadata, Viewport } from 'next';
import { Manrope, Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const notoSansJp = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto' });

export const metadata: Metadata = {
  title: 'Crewami — Interactive Mobile Prototype',
  description: 'Interactive UI prototype for Crewami shift and attendance management.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#102a2d',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${manrope.variable} ${notoSansJp.variable}`}>{children}</body>
    </html>
  );
}
