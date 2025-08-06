import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/store/providers';
import { ConfigProvider } from 'antd';
import Layout from '@/components/layout/Layout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce Platform',
  description: 'Modern e-commerce platform built with Next.js, Node.js, and MongoDB',
  keywords: 'e-commerce, shopping, online store, next.js, react',
  authors: [{ name: 'E-Commerce Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'E-Commerce Platform',
    description: 'Modern e-commerce platform built with Next.js, Node.js, and MongoDB',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#3b82f6',
                borderRadius: 8,
                fontFamily: 'Inter, system-ui, sans-serif',
              },
            }}
          >
            <Layout>
              {children}
            </Layout>
          </ConfigProvider>
        </Providers>
      </body>
    </html>
  );
} 