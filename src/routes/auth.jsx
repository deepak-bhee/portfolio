import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ALLOWED_EMAIL = "deepakbhee2006@gmail.com";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Sign in — Portfolio" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate   = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [checking, setChecking] = useState(true);

  /* Redirect if already signed in */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
      else setChecking(false);
    });
  }, [navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) return toast.error("Email and password are required");
    if (email.trim().toLowerCase() !== ALLOWED_EMAIL) {
      return toast.error("Access restricted: Only the owner is authorized to log in.");
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back! 👋");
      navigate({ to: "/admin" });
    } catch (err) {
      const msg = err.message ?? "Something went wrong";
      if (msg.includes("Invalid login")) toast.error("Incorrect email or password.");
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary-glow/25 blur-3xl animate-blob" style={{ animationDelay: "5s" }} />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 py-12">
        <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to portfolio
        </Link>

        <div className="w-full rounded-3xl border bg-card/90 backdrop-blur-sm p-8 shadow-card">
          {/* Icon + title */}
          <div className="mb-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
              <LogIn className="h-5 w-5" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold">Admin sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Access the dashboard to manage your portfolio.
            </p>
          </div>

          {/* Form — sign in only, no signup */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium">Email</label>
              <Input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1.5 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-medium">Password</label>
              <div className="relative mt-1.5">
                <Input
                  type={showPw ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl pr-10 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="mt-2 w-full rounded-full bg-gradient-primary shadow-glow hover:opacity-90 active:scale-98 transition-all"
            >
              {loading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait…</>
                : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
