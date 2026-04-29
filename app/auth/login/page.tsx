"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthFrame } from "@/components/dashboard/AuthFrame";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api, saveAuth } from "@/lib/api";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const result = await api.login({ email, password });
      saveAuth(result);
      toast.success("Session authenticated");
      router.push("/dashboard/upload");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame
      title="Sign in"
      subtitle="Enter credentials to resume your diagnostic session."
      alt={{
        text: "No account yet?",
        linkText: "Request access →",
        href: "/auth/register",
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="email"
          type="email"
          label="EMAIL"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <Input
          id="password"
          type="password"
          label="PASSWORD"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" size="lg" loading={loading} className="w-full">
          AUTHENTICATE
          <ArrowRight size={14} strokeWidth={2.5} />
        </Button>
      </form>
    </AuthFrame>
  );
}
