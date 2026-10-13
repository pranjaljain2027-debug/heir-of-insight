import { createFileRoute } from "@tanstack/react-router";
import PublicPage from "@/components/wisdom/public-pages";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works | Heir of Wisdom" },
      { name: "description", content: "How It Works — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:title", content: "How It Works | Heir of Wisdom" },
      { property: "og:description", content: "How It Works — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <PublicPage kind="how-it-works" />;
}
