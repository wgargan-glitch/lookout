import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { hideSocialLogins } from "@/lib/native-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [iosApp, setIosApp] = useState(false);

  useEffect(() => {
    setIosApp(hideSocialLogins());
  }, []);

  if (!isPending && user) {
    return <Navigate to="/account" />;
  }

  async function onEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "Lookout guest");
    setPending(true);
    setError(null);
    try {
      if (mode === "up") {
        const res = await authClient.signUp.email({ email, password, name, callbackURL: "/account" });
        if (res.error) throw new Error(res.error.message || "Could not create the account.");
      } else {
        const res = await authClient.signIn.email({ email, password, callbackURL: "/account" });
        if (res.error) throw new Error(res.error.message || "Could not sign in.");
      }
      void window.location.assign("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="relative overflow-hidden">
      <img src="/images/parks/zion.jpg" alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-ink/60" />
      <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md p-6">
          <h2 className="font-display text-3xl">{mode === "up" ? "Create an account" : "Sign in"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {iosApp ? "Email and password. Your trips follow you." : "Google, X, or email. Your trips follow you."}
          </p>

          {authEnabled && !iosApp ? (
            <div className="mt-6 space-y-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => signIn(p.providerId, { callbackURL: "/account" })}
                >
                  Continue with {p.label}
                </Button>
              ))}
            </div>
          ) : authEnabled ? null : (
            <p className="mt-6 text-sm text-muted-foreground">Sign-in is disabled.</p>
          )}

          {iosApp ? null : (
            <div className="my-6 flex items-center gap-3 text-xs tracking-wide text-muted-foreground uppercase">
              <span className="h-px flex-1 bg-border" />
              or email
              <span className="h-px flex-1 bg-border" />
            </div>
          )}

          <form onSubmit={onEmail} className={iosApp ? "mt-6 grid gap-3" : "grid gap-3"}>
            {mode === "up" ? (
              <div className="space-y-1.5">
                <Label htmlFor="name">Trail name</Label>
                <Input id="name" name="name" required placeholder="Juniper" />
              </div>
            ) : null}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required minLength={8} autoComplete={mode === "up" ? "new-password" : "current-password"} />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Working…" : mode === "up" ? "Create account" : "Sign in with email"}
            </Button>
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            {mode === "up" ? (
              <>
                Already on Lookout?{" "}
                <button type="button" className="underline" onClick={() => setMode("in")}>
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button type="button" className="underline" onClick={() => setMode("up")}>
                  Create an account
                </button>
              </>
            )}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            By continuing you agree to the{" "}
            <Link to="/terms" className="underline">
              terms
            </Link>
            ,{" "}
            <Link to="/privacy" className="underline">
              privacy policy
            </Link>
            , and{" "}
            <Link to="/protection" className="underline">
              protection waiver
            </Link>
            .
          </p>
        </Card>
      </div>
    </main>
  );
}
