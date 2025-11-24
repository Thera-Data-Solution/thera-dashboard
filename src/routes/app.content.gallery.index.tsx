import { createFileRoute } from '@tanstack/react-router'
import Gallery from "@/screen/content/gallery";

export const Route = createFileRoute('/app/content/gallery/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Gallery />
}
