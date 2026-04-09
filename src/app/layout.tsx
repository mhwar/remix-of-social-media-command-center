import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export const metadata: Metadata = {
  title: "نظام إدارة المحتوى",
  description:
    "نظام احترافي لإدارة محتوى العملاء ودليل الجهات وتصدير سياق جاهز للذكاء الاصطناعي",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-muted/40 antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col">
            <Topbar />
            <main className="flex-1 p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
