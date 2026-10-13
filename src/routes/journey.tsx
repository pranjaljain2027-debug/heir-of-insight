import { createFileRoute } from "@tanstack/react-router";
import PublicPage from "@/components/wisdom/public-pages";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Journey | Heir of Wisdom" },
      { name: "description", content: "Journey — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:title", content: "Journey | Heir of Wisdom" },
      { property: "og:description", content: "Journey — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <PublicPage kind="journey" />;
}
