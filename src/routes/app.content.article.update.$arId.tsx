import { getArticleById, updateArticle } from '@/api/articles';
import { PostForm } from '@/components/form/post-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner';

export const Route = createFileRoute('/app/content/article/update/$arId')({
  loader: ({ context, params }) =>
    context.queryClient.prefetchQuery({
      queryKey: ["article", params.arId],
      queryFn: () => getArticleById(params.arId),
    }),
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = Route.useRouteContext().queryClient
  const navigate = Route.useNavigate()
  const { arId } = Route.useParams()
  
  const { data: post, isFetching } = useQuery({
    queryKey: ["article", arId],
    queryFn: () => getArticleById(arId),
  });

  // ⛔ HOOKS TIDAK BOLEH DI BAWAH RETURN CONDITION
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: FormData }) => {
      return updateArticle(id, data)
    },
    onSuccess: () => {
      toast.success("Berhasil")
      queryClient.invalidateQueries({
        queryKey: ["articles"]
      })
      navigate({
        to: '/app/content/articles',
        replace: true
      })
    },
    onError: () => {
      toast.error("Gagal")
    }
  })

  const handleEdit = (values: FormData) => {
    mutation.mutate({ id: arId, data: values })
  }

  // Kondisi render aman → setelah semua hooks
  if (isFetching) return <div>Loading...</div>
  if (!post) return <div>No data</div>

  return (
    <PostForm
      defaultValues={{
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        isPublished: post.isPublished,
        body: JSON.parse(post.body) || [],
        coverImage: post.coverImage ?? "",
      }}
      onSubmit={handleEdit}
    />
  )
}
