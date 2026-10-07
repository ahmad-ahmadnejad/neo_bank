import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import NextTopLoader from 'nextjs-toploader';
import localFont from 'next/font/local';

const iranSans = localFont({
  src: [
    { path: '../../public/fonts/iransans/IRANSansWeb(FaNum)_UltraLight.woff2', weight: '200', style: 'normal' },
    { path: '../../public/fonts/iransans/IRANSansWeb(FaNum)_Light.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/iransans/IRANSansWeb(FaNum).woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/iransans/IRANSansWeb(FaNum)_Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/iransans/IRANSansWeb(FaNum)_Bold.woff2', weight: '700', style: 'normal' }
  ],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "رسا سامانه | بانکداری نوین و هوشمند",
  description: "کنترل مالی شما در یک نمای آرام",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`h-full antialiased ${iranSans.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextTopLoader color="#3b82f6" showSpinner={false} height={3} />
        <QueryProvider>
          {children}
          <Toaster position="bottom-center" toastOptions={{ className: '!bg-surface-raised !text-white !border !border-white/10 !rounded-xl !shadow-[0_10px_40px_rgba(0,0,0,0.5)]', style: { direction: 'rtl' } }} />
        </QueryProvider>
      </body>
    </html>
  );
}
