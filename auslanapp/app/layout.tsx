import type { Metadata } from "next";
import "./globals.css";
import { Quicksand } from "next/font/google";
import clsx from "clsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Auslan Fingerspelling",
  description: "Australia Sign Language with AI-powered Hand Sign Recognition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          quicksand.className,
          "w-full antialiased flex h-screen",
        )}
      >
        <SidebarProvider defaultOpen={false}>
          <div className="grid grid-cols-[auto,1fr] w-full">
            <AppSidebar />
            <main className="flex flex-col h-screen">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
