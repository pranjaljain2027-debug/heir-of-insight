import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "@/components/wisdom/auth-page";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account | Heir of Wisdom" },
      { name: "description", content: "Create your account — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:title", content: "Create your account | Heir of Wisdom" },
      { property: "og:description", content: "Create your account — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return <AuthPage mode="signup" />;
}
