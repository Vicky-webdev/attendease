"use client";

import { Bell, Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme-provider";
import { format } from "date-fns";

export function Header() {
  const today = new Date();
  const greeting = getGreeting();
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-base font-medium">
          {format(today, "EEEE, MMMM d")}
        </h1>
        <p className="text-sm text-muted-foreground">{greeting}, Vignesh</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        <button className="relative w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
        </button>
        <Avatar className="w-9 h-9">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
            VK
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
