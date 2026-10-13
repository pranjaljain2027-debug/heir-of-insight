import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "@/components/wisdom/auth-page";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in | Heir of Wisdom" },
      { name: "description", content: "Sign in — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:title", content: "Sign in | Heir of Wisdom" },
      { property: "og:description", content: "Sign in — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <AuthPage mode="login" />;
}
