import { createFileRoute } from "@tanstack/react-router";
import LearningHistory from "@/components/wisdom/learning-history";

export const Route = createFileRoute("/discoveries")({
  head: () => ({
    meta: [
      { title: "Discoveries | Heir of Wisdom" },
      { name: "description", content: "Discoveries — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:title", content: "Discoveries | Heir of Wisdom" },
      { property: "og:description", content: "Discoveries — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <LearningHistory view="discoveries" />;
}
