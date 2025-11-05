import { getCategoryById } from '@/api/categories';
import CategoryUpdate from '@/screen/event/category/update'
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/event/categories/update/$catId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { catId } = Route.useParams()
  const { data: category, isLoading } = useQuery({
    queryKey: ["category", catId],
    queryFn: () => getCategoryById(catId),
  });

  if (isLoading) return <div>Loading...</div>
  if (!category) return <div>No data</div>
  return (
    <div>
      <CategoryUpdate category={category} />
    </div>
  )
}
