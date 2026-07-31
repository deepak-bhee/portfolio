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

const ALLOWED_ADMIN_EMAIL = "deepakbhee2006@gmail.com";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Portfolio" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign out error:", e);
    } finally {
      window.location.href = "/auth";
    }
  }

  const isOwner = user?.email?.toLowerCase() === ALLOWED_ADMIN_EMAIL;

  /* ── Loading state ─────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Verifying access…</p>
        </div>
      </div>
    );
  }

  /* ── Not admin or not owner ───────────────────────────────── */
  if (!isAdmin || !isOwner) {
    return (
      <div className="grid min-h-screen place-items-center px-4 bg-background">
        <div className="max-w-md w-full rounded-3xl border bg-card p-6 sm:p-8 text-center shadow-card">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-red-500/10 text-red-500">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="font-display text-xl font-bold">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Only the site owner is authorized to access the admin dashboard.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/">
              <Button variant="outline" className="rounded-full">
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Home
              </Button>
            </Link>
            <Button onClick={signOut} className="rounded-full bg-gradient-primary hover:opacity-90">
              <LogOut className="mr-1.5 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Admin dashboard ───────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md w-full">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 sm:px-6 py-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link to="/" className="flex shrink-0 items-center gap-1 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> <span className="hidden xs:inline">Site</span>
            </Link>
            <span className="text-muted-foreground/60">/</span>
            <h1 className="font-display text-xs sm:text-base font-bold truncate">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 max-w-[180px]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={signOut} className="rounded-full hover:border-red-400 hover:text-red-500 transition-colors text-xs px-3 sm:px-4">
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-3 sm:px-6 py-4 sm:py-8 w-full overflow-hidden">
        <Tabs defaultValue="projects" className="w-full">
          {/* Scrollable Tabs Header on Mobile */}
          <div className="w-full overflow-x-auto pb-2 scrollbar-none mb-6">
            <TabsList className="rounded-full inline-flex w-max gap-1 p-1 bg-muted/60">
              <TabsTrigger value="projects" className="rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5">
                <FolderGit2 className="mr-1.5 h-3.5 w-3.5" />Projects
              </TabsTrigger>
              <TabsTrigger value="certificates" className="rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5">
                <Award className="mr-1.5 h-3.5 w-3.5" />Certificates
              </TabsTrigger>
              <TabsTrigger value="learning" className="rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5">
                <BookOpen className="mr-1.5 h-3.5 w-3.5" />Learning
              </TabsTrigger>
              <TabsTrigger value="education" className="rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5">
                <GraduationCap className="mr-1.5 h-3.5 w-3.5" />Education
              </TabsTrigger>
              <TabsTrigger value="messages" className="rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5">
                <Mail className="mr-1.5 h-3.5 w-3.5" />Messages
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="projects"     className="mt-0 focus-visible:outline-none"><ProjectsAdmin /></TabsContent>
          <TabsContent value="certificates" className="mt-0 focus-visible:outline-none"><CertificatesAdmin /></TabsContent>
          <TabsContent value="learning"     className="mt-0 focus-visible:outline-none"><ExperiencesAdmin /></TabsContent>
          <TabsContent value="education"    className="mt-0 focus-visible:outline-none"><EducationAdmin /></TabsContent>
          <TabsContent value="messages"     className="mt-0 focus-visible:outline-none"><MessagesAdmin /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
