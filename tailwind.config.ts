import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { ink: '#102a43', mist: '#f5f7fb', coral: '#ef8354', teal: '#2a9d8f' }, boxShadow: { soft: '0 12px 35px rgba(16,42,67,.08)' } } }, plugins: [] };
export default config;
