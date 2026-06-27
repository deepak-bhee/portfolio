import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, LogOut, FolderGit2, Award, Mail, BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsAdmin }     from "@/components/portfolio/admin/ProjectsAdmin";
import { CertificatesAdmin } from "@/components/portfolio/admin/CertificatesAdmin";
import { MessagesAdmin }     from "@/components/portfolio/admin/MessagesAdmin";
import { ExperiencesAdmin }  from "@/components/portfolio/admin/ExperiencesAdmin";
import { EducationAdmin }    from "@/components/portfolio/admin/EducationAdmin";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Portfolio" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  /* ── Loading state ─────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Verifying access…</p>
        </div>
      </div>
    );
  }

  /* ── Not admin ─────────────────────────────────────────────── */
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-5 bg-background">
        <div className="max-w-md w-full rounded-3xl border bg-card p-8 text-center shadow-card">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-red-100 dark:bg-red-900/30">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="font-display text-xl font-bold">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{user?.email}</span> does not have admin privileges.
            Ask the project owner to grant you the <code className="rounded bg-accent px-1 py-0.5 text-xs">admin</code> role via Supabase.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/"><Button variant="outline" className="rounded-full"><ArrowLeft className="mr-1 h-4 w-4" /> Home</Button></Link>
            <Button onClick={signOut} className="rounded-full bg-gradient-primary hover:opacity-90"><LogOut className="mr-1 h-4 w-4" /> Sign out</Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Admin dashboard ───────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Site
            </Link>
            <span className="text-muted-foreground">/</span>
            <h1 className="font-display text-base font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={signOut} className="rounded-full hover:border-red-400 hover:text-red-500 transition-colors">
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-5 py-8">
        <Tabs defaultValue="projects">
          <div className="overflow-x-auto pb-1">
            <TabsList className="rounded-full inline-flex w-auto gap-1 mb-6">
              <TabsTrigger value="projects"     className="rounded-full text-xs sm:text-sm"><FolderGit2 className="mr-1.5 h-3.5 w-3.5 hidden sm:block" />Projects</TabsTrigger>
              <TabsTrigger value="certificates" className="rounded-full text-xs sm:text-sm"><Award className="mr-1.5 h-3.5 w-3.5 hidden sm:block" />Certificates</TabsTrigger>
              <TabsTrigger value="learning"     className="rounded-full text-xs sm:text-sm"><BookOpen className="mr-1.5 h-3.5 w-3.5 hidden sm:block" />Learning</TabsTrigger>
              <TabsTrigger value="education"    className="rounded-full text-xs sm:text-sm"><GraduationCap className="mr-1.5 h-3.5 w-3.5 hidden sm:block" />Education</TabsTrigger>
              <TabsTrigger value="messages"     className="rounded-full text-xs sm:text-sm"><Mail className="mr-1.5 h-3.5 w-3.5 hidden sm:block" />Messages</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="projects"     className="mt-0"><ProjectsAdmin /></TabsContent>
          <TabsContent value="certificates" className="mt-0"><CertificatesAdmin /></TabsContent>
          <TabsContent value="learning"     className="mt-0"><ExperiencesAdmin /></TabsContent>
          <TabsContent value="education"    className="mt-0"><EducationAdmin /></TabsContent>
          <TabsContent value="messages"     className="mt-0"><MessagesAdmin /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
