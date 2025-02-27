import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { PlayersProvider } from "@/contexts/PlayersContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Performance Dashboard",
  description: "Dashboard pour suivre les performances des joueurs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} h-full`}>
        <PlayersProvider>
          <div className="min-h-screen">
            <div className="flex min-h-screen">
              {/* Sidebar */}
              <Sidebar />

              {/* Main content */}
              <div className="flex-1 flex flex-col min-h-screen">
                {/* Top header */}
                <Header />

                {/* Page content */}
                <main className="flex-1 py-6">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </div>
        </PlayersProvider>
      </body>
    </html>
  );
}
