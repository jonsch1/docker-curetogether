import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RareDiseasePlatformSidebar from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/sonner"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CureTogether",
  description: "Collaborative Research Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    >
            <SidebarProvider>
              <RareDiseasePlatformSidebar>
                <main className="p-4 container mx-auto">
                    {children}
                  <Toaster />
                </main>
              </RareDiseasePlatformSidebar>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
