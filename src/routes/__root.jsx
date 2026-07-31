import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, useLocation, HeadContent, Scripts, } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "../lib/theme";
import { Toaster } from "sonner";
import LightRays from "../components/portfolio/LightRays";
import { Navbar } from "../components/portfolio/Navbar";

/** Returns streakCount based on viewport width */
function useResponsiveStreaks() {
  const getCount = () => {
    const w = window.innerWidth;
    if (w < 480) return 2;
    if (w < 768) return 3;
    if (w < 1280) return 4;
    return 5;
  };

  const [count, setCount] = useState(() =>
    typeof window !== "undefined" ? getCount() : 4
  );

  useEffect(() => {
    const handler = () => setCount(getCount());
    const ro = new ResizeObserver(handler);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  return count;
}

function NotFoundComponent() {
  return (<div className="flex min-h-screen items-center justify-center px-4">
    <div className="max-w-md text-center">
      <h1 className="text-7xl font-bold text-white">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-white">Page not found</h2>
      <p className="mt-2 text-sm text-white/60">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6">
        <Link to="/" className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90">
          Go home
        </Link>
      </div>
    </div>
  </div>);
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (<div className="flex min-h-screen items-center justify-center px-4">
    <div className="max-w-md text-center">
      <h1 className="text-xl font-semibold tracking-tight text-white">
        This page didn't load
      </h1>
      <p className="mt-2 text-sm text-white/60">
        Something went wrong on our end. You can try refreshing or head back home.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button onClick={() => {
          router.invalidate();
          reset();
        }} className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90">
          Try again
        </button>
        <a href="/" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
          Go home
        </a>
      </div>
    </div>
  </div>);
}
export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Deepak — Full-Stack Developer" },
      { name: "description", content: "Personal portfolio of Deepak, a full-stack developer building fast, accessible, and beautiful web products." },
      { name: "author", content: "Deepak" },
      { property: "og:title", content: "Deepak — Full-Stack Developer" },
      { property: "og:description", content: "Personal portfolio of Deepak, a full-stack developer building fast, accessible, and beautiful web products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Deepak — Full-Stack Developer" },
      { name: "twitter:description", content: "Personal portfolio of Deepak, a full-stack developer building fast, accessible, and beautiful web products." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/02061e80-8f61-4e31-98d6-3aa329776022/id-preview-00df70cc--f5a5ddfb-6cb3-4620-ab8c-aad45131a2cd.lovable.app-1782367622656.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/02061e80-8f61-4e31-98d6-3aa329776022/id-preview-00df70cc--f5a5ddfb-6cb3-4620-ab8c-aad45131a2cd.lovable.app-1782367622656.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});
function RootShell({ children }) {
  return (<html lang="en">
    <head>
      <HeadContent />
    </head>
    <body>
      {children}
      <Scripts />
    </body>
  </html>);
}
function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const isAuthOrAdmin = location.pathname.startsWith("/admin") || location.pathname.startsWith("/auth");
  const streakCount = useResponsiveStreaks();
  useEffect(() => setMounted(true), []);

  return (<QueryClientProvider client={queryClient}>
    <ThemeProvider>
      {/* ── Fixed Lightfall background (all pages) ── */}
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#5685d1ff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>

      {/* ── Navbar (only on main portfolio pages) ── */}
      {!isAuthOrAdmin && <Navbar />}

      {/* ── Route content ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Outlet />
      </div>

      <div suppressHydrationWarning>{mounted && <Toaster richColors position="top-right" />}</div>
    </ThemeProvider>
  </QueryClientProvider>);
}

