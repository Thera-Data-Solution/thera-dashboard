import { getCategories } from '@/api/categories';
import CategoryClient from '@/screen/event/category'
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/event/categories/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  if(isLoading) return <div>Loading...</div>
  if(!data) return <div>No data</div>
  return (
    <div>
      <div className='font-bold text-xl'>Event Categories</div>
      <CategoryClient categories={data || []} />
    </div>
)
}
