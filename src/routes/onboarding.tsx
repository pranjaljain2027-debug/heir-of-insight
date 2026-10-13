import { createFileRoute } from "@tanstack/react-router";
import Onboarding from "@/components/wisdom/onboarding";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your child | Heir of Wisdom" },
      { name: "description", content: "Set up your child — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:title", content: "Set up your child | Heir of Wisdom" },
      { property: "og:description", content: "Set up your child — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <Onboarding />;
}
