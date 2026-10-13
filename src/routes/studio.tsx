import { createFileRoute } from "@tanstack/react-router";
import PublicPage from "@/components/wisdom/public-pages";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Studio | Heir of Wisdom" },
      { name: "description", content: "Studio — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:title", content: "Studio | Heir of Wisdom" },
      { property: "og:description", content: "Studio — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <PublicPage kind="studio" />;
}
