import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { SidebarConfigProvider } from "@/contexts/sidebar-context";
import { Bebas_Neue, Inter } from "next/font/google";
import QueryProvider from "@/Providers/QueryProvider";



const inter = Inter({ subsets: ['latin'] })
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'] })
export const metadata : Metadata = {
  title: "ICMS - Integrated Cooperative Management System",
  description:
    "ICMS is a comprehensive system designed to streamline cooperative management processes, enhance member services, and improve operational efficiency.",
  icons: {
    icon: "/",
  },
  keywords: [
    "cooperative management system",
    "member management",
    "financial management",
    "reporting and analytics",
    "communication tools",
    "mobile accessibility",
    "data security",
    "user-friendly interface",
    "customizable features",
    "scalable solution",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebasNeue.className} antialiased`}>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="nextjs-ui-theme">
          <SidebarConfigProvider>
            <QueryProvider>{children}</QueryProvider>
          </SidebarConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
