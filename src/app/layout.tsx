import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Oblivion Planner',
  description:
    'Optimize your Oblivion character from start to finish. Plan skills, attributes, and level-ups to avoid inefficiencies and dominate Tamriel.',
  openGraph: {
    title: 'Deadbeat Club',
    description:
      'Optimize your Oblivion character from start to finish. Plan skills, attributes, and level-ups to avoid inefficiencies and dominate Tamriel.',
    url: 'https://oblivionplanner.com',
    siteName: 'Oblivion Planner',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oblivion Planner',
    description:
      'Optimize your Oblivion character from start to finish. Plan skills, attributes, and level-ups to avoid inefficiencies and dominate Tamriel.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body id="root" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
