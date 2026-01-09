import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Harry Burnham & Adia Shane | Wedding',
  description: 'We\'re getting married! Join us on 10th October 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
