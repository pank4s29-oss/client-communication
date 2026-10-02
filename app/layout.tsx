import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: '晨星家長客服 CRM', description: 'LINE 家長客服工作台' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="zh-Hant"><body>{children}</body></html>; }
