import { createFileRoute } from "@tanstack/react-router";
import PublicPage from "@/components/wisdom/public-pages";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Heir of Wisdom" },
      { name: "description", content: "FAQ — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:title", content: "FAQ | Heir of Wisdom" },
      { property: "og:description", content: "FAQ — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <PublicPage kind="faq" />;
}
