import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/components/wisdom/home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heir of Wisdom — A cognitive learning studio" },
      { name: "description", content: "A cognitive learning studio — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:title", content: "Heir of Wisdom — A cognitive learning studio" },
      { property: "og:description", content: "A cognitive learning studio — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <HomePage />;
}
