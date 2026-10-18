import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heir of Wisdom — Teach your child to see what others miss" },
      { name: "description", content: "A visual way for children to practise reasoning through patterns, shapes and relationships." },
      { property: "og:title", content: "Heir of Wisdom — Teach your child to see what others miss" },
      { property: "og:description", content: "A visual way for children to practise reasoning through patterns, shapes and relationships." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <span className="text-xs tracking-widest text-muted-foreground">COGNITIVE LEARNING · REIMAGINED</span>
      <h1 className="mt-4 font-display text-5xl text-foreground">Teach your child to see what others miss.</h1>
      <p className="mt-6">
        Heir of Wisdom is being rebuilt as a hands-on demo. The sample question and demo studio are coming next.
      </p>
    </main>
  );
}
