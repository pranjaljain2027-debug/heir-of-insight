import { createFileRoute } from "@tanstack/react-router";
import LearningHistory from "@/components/wisdom/learning-history";

export const Route = createFileRoute("/parent")({
  head: () => ({
    meta: [
      { title: "Parent dashboard | Heir of Wisdom" },
      { name: "description", content: "Parent — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:title", content: "Parent dashboard | Heir of Wisdom" },
      { property: "og:description", content: "Parent — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <LearningHistory view="parent" />;
}
