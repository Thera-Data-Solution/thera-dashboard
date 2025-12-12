import { getArticles } from '@/api/articles'
import ArticleClient from '@/screen/content/articles'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from "@/components/ui/skeleton.tsx";
import Pager from '@/components/pagination2';

export const Route = createFileRoute('/app/content/articles/')({
  validateSearch: (search) => {
    return {
      page: Number(search.page) || 1,
      pageSize: Number(search.pageSize) || 6,
    }
  },
  loaderDeps: ({ search: { page, pageSize } }) => ({ page, pageSize }),
  loader: ({ context, deps: { page, pageSize } }) =>
    context.queryClient.prefetchQuery({
      queryKey: ["articles", { page, pageSize }],
      queryFn: () => getArticles({ pageSize, page }),
    }),
  component: RouteComponent,
})

function RouteComponent() {
  const { page, pageSize } = Route.useSearch();
  const router = Route.useNavigate()
  const { data, isLoading } = useQuery({
    queryKey: ["articles", { page, pageSize }],
    queryFn: () => getArticles({ page, pageSize }),
  })

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-[30px] w-[300px] rounded-md" />
        <Skeleton className={"w-full h-[200px] mt-8"} />
      </div>
    )
  }

  if (data && data.data.length > 0) {
    return (
      <>
        <ArticleClient data={data.data} />
        <Pager
          page={page}
          totalPages={data?.totalPages}
          onPageChange={(newPage: number) => {
            router({
              search: (prev) => ({
                ...prev,
                page: newPage,
              }),
            });
          }}
        />
      </>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center w-[100%]">
      <ArticleClient data={[]} />
    </div>
  )
}
