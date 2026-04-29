"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthFrame } from "@/components/dashboard/AuthFrame";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api, saveAuth } from "@/lib/api";
import { ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const result = await api.register({ fullName, email, password });
      saveAuth(result);
      toast.success("Account provisioned · welcome aboard");
      router.push("/dashboard/upload");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFrame
      title="Request access"
      subtitle="Provision a new diagnostic session. Takes 5 seconds."
      alt={{
        text: "Already have credentials?",
        linkText: "Sign in →",
        href: "/auth/login",
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="fullName"
          label="FULL NAME"
          placeholder="Aman Patel"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoFocus
        />
        <Input
          id="email"
          type="email"
          label="EMAIL"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          type="password"
          label="PASSWORD"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <Button type="submit" size="lg" loading={loading} className="w-full">
          PROVISION ACCESS
          <ArrowRight size={14} strokeWidth={2.5} />
        </Button>

        <p className="font-mono text-[10px] leading-relaxed text-abyss-500">
          By requesting access you agree to not abuse the system and to be cool
          about rate limits.
        </p>
      </form>
    </AuthFrame>
  );
}
