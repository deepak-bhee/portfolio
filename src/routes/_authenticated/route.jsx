import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const ALLOWED_ADMIN_EMAIL = "deepakbhee2006@gmail.com";

export const Route = createFileRoute("/_authenticated")({
    ssr: false,
    beforeLoad: async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
            throw redirect({ to: "/auth" });
        }
        if (data.user.email?.toLowerCase() !== ALLOWED_ADMIN_EMAIL) {
            await supabase.auth.signOut();
            throw redirect({ to: "/auth" });
        }
        return { user: data.user };
    },
    component: () => <Outlet />,
});
