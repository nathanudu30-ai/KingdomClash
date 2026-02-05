import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  weight: ['700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Kingdom Clash - Build Your Empire',
  description: 'Modern social mobile game combining slot machine mechanics with urban construction and competitive PvP',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#0F172A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-navy-900 text-navy-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
