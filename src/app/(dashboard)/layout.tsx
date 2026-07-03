"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { ChatWindow } from "@/components/chat/chat-window";
import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-6 md:pt-6">
        {children}
      </main>
      <ChatWindow />
    </div>
  );
}
