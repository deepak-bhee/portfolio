import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ALLOWED_ADMIN_EMAIL = "deepakbhee2006@gmail.com";

export function useAuth() {
  const [user, setUser]           = useState(null);
  const [isAdmin, setIsAdmin]     = useState(false);
  const [loading, setLoading]     = useState(true); // true until BOTH user + role resolved

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      const u = session?.user ?? null;
      if (cancelled) return;
      setUser(u);

      const isOwner = u?.email?.toLowerCase() === ALLOWED_ADMIN_EMAIL;

      if (u && isOwner) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", u.id);
        if (!cancelled) setIsAdmin(!!data?.some((r) => r.role === "admin"));
      } else {
        if (!cancelled) setIsAdmin(false);
      }
      if (!cancelled) setLoading(false);
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setIsAdmin(false);
      setLoading(true);

      const isOwner = u?.email?.toLowerCase() === ALLOWED_ADMIN_EMAIL;

      if (u && isOwner) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", u.id);
        setIsAdmin(!!data?.some((r) => r.role === "admin"));
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
}
