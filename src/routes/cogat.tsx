import { createFileRoute } from "@tanstack/react-router";
import PublicPage from "@/components/wisdom/public-pages";

export const Route = createFileRoute("/cogat")({
  head: () => ({
    meta: [
      { title: "CogAT | Heir of Wisdom" },
      { name: "description", content: "CogAT — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:title", content: "CogAT | Heir of Wisdom" },
      { property: "og:description", content: "CogAT — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <PublicPage kind="cogat" />;
}
