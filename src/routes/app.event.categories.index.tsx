import { getCategories } from '@/api/categories';
import CategoryClient from '@/screen/event/category'
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import {Skeleton} from "@/components/ui/skeleton.tsx";

export const Route = createFileRoute('/app/event/categories/')({
  loaderDeps: () => ({}),
  loader: ({ context }) =>
    context.queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: getCategories,
    }),

  component: RouteComponent,
})

function RouteComponent() {
   const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  if(isLoading){
      return(
          <div>
              <Skeleton className="h-[30px] w-[300px] rounded-md" />
              <Skeleton className={"w-full h-[200px] mt-8"} />
              <Skeleton className={"w-full h-[200px] mt-8"} />
              <Skeleton className={"w-full h-[200px] mt-8"} />
          </div>
      )
  }

  return (
    <div>
      <div className='font-bold text-xl'>Event Categories</div>
      <CategoryClient categories={data || []} />
    </div>
  )
}
