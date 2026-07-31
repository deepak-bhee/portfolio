import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Learning } from "@/components/portfolio/Experience";
import { Education } from "@/components/portfolio/Education";
import { Certificates } from "@/components/portfolio/Certificates";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deepak — Full-Stack Developer" },
      { name: "description", content: "Portfolio of Deepak, a full-stack developer crafting fast, accessible, and beautiful web products with React, Node.js and modern cloud tools." },
      { property: "og:title", content: "Deepak — Full-Stack Developer" },
      { property: "og:description", content: "Projects, learning, and ways to get in touch." },
    ],
  }),
  component: Index,
});

function Index() {
  useSmoothScroll();

  return (
    <div className="min-h-screen animate-page-in">
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Learning />
        <Education />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
