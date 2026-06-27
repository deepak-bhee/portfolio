import { useEffect, useState } from "react";
import { ArrowUp, Github, Linkedin, Twitter, Mail } from "lucide-react";

const socials = [
  { icon: Github,   href: "https://github.com/deepak-bhee",                    label: "GitHub"   },
  { icon: Linkedin, href: "https://www.linkedin.com/in/deepak-b-60620b375/",   label: "LinkedIn" },
  { icon: Twitter,  href: "https://twitter.com",                                label: "Twitter"  },
  { icon: Mail,     href: "mailto:deepakbhee2006@gmail.com",                   label: "Email"    },
];

export function Footer() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="relative border-t bg-card/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <p className="font-display text-xl font-bold">
            <span className="gradient-text">Deepak</span>.
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Full-stack developer crafting fast, accessible, and beautiful web products.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quick links
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {["About", "Projects", "Learning", "Contact"].map((label) => (
              <li key={label}>
                <a
                  href={`#${label.toLowerCase()}`}
                  className="text-muted-foreground transition-all duration-200 hover:text-primary hover:translate-x-1 inline-block"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Follow
          </p>
          <div className="mt-3 flex gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border bg-card
                           transition-all duration-200 hover:bg-accent hover:text-primary hover:-translate-y-1 hover:shadow-soft active:scale-95"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-5 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Deepak. Built with ❤️ using React &amp; Tailwind.
        </p>
      </div>

      {/* Back to top — animated in/out */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_oklch(0.55_0.24_285_/_0.6)] active:scale-95
                    ${show ? "opacity-100 translate-y-0 animate-scale-in" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
}
