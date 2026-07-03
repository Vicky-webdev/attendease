"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || isAuthenticated) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        router.replace("/");
      } else {
        setError(result.error || "Login failed");
      }
      setSubmitting(false);
    }, 500);
  };

  const quickLogin = (qEmail: string, role: string) => {
    const pwd = role === "admin" ? "admin123" : "emp123";
    setEmail(qEmail);
    setPassword(pwd);
    setError("");
    setSubmitting(true);
    setTimeout(() => {
      const result = login(qEmail, pwd);
      if (result.success) {
        router.replace("/");
      } else {
        setError(result.error || "Login failed");
      }
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-lg font-medium mx-auto mb-4">
            A
          </div>
          <h1 className="text-xl font-medium">AttendEase</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your account
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-teal-600 text-primary-foreground"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Card>

        {/* Quick login helpers */}
        <Card className="p-4 mt-3">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2.5">
            Demo accounts
          </p>
          <div className="space-y-2">
            <button
              onClick={() => quickLogin("arjun@company.com", "admin")}
              className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Shield className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Admin login</p>
                <p className="text-[11px] text-muted-foreground">
                  arjun@company.com / admin123
                </p>
              </div>
            </button>
            <button
              onClick={() => quickLogin("priya@company.com", "admin")}
              className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Shield className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">HR login</p>
                <p className="text-[11px] text-muted-foreground">
                  priya@company.com / admin123
                </p>
              </div>
            </button>
            <button
              onClick={() => quickLogin("vignesh@company.com", "employee")}
              className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Manager login</p>
                <p className="text-[11px] text-muted-foreground">
                  vignesh@company.com / emp123
                </p>
              </div>
            </button>
            <button
              onClick={() => quickLogin("sara@company.com", "employee")}
              className="w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Users className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Employee login</p>
                <p className="text-[11px] text-muted-foreground">
                  sara@company.com / emp123
                </p>
              </div>
            </button>
          </div>
        </Card>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Contact your HR administrator if you need access
        </p>
      </div>
    </div>
  );
}
