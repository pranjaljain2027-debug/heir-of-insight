import { createFileRoute } from "@tanstack/react-router";
import PublicPage from "@/components/wisdom/public-pages";

export const Route = createFileRoute("/learn/$activityId")({
  head: () => ({
    meta: [
      { title: "Learning activity | Heir of Wisdom" },
      { name: "description", content: "Learning activity — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:title", content: "Learning activity | Heir of Wisdom" },
      { property: "og:description", content: "Learning activity — Heir of Wisdom, a cognitive learning studio for curious children." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { activityId } = Route.useParams();
  return <PublicPage kind={activityId} />;
}
