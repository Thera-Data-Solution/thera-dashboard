import { getArticles } from '@/api/articles'
import ArticleClient from '@/screen/content/articles'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {Skeleton} from "@/components/ui/skeleton.tsx";

export const Route = createFileRoute('/app/content/articles/')({
  loader: ({ context }) =>
    context.queryClient.prefetchQuery({
      queryKey: ["articles"],
      queryFn: () => getArticles(),
    }),
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: () => getArticles(),
  })

  if (isLoading) {
    return(
        <div>
            <Skeleton className="h-[30px] w-[300px] rounded-md" />
            <Skeleton className={"w-full h-[200px] mt-8"} />
        </div>
    )
  }

  if (data && data.data.length > 0) {
    return <ArticleClient data={data.data} />
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center w-[100%]">
      <ArticleClient data={[]} />
    </div>
  )
}
