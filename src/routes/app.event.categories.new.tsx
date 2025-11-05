import CategoryCreate from '@/screen/event/category/new'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/event/categories/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CategoryCreate />
}
