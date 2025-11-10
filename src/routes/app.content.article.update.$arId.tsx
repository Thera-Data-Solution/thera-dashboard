import { getArticleById, updateArticle } from '@/api/articles';
import { PostForm } from '@/components/form/post-form';
import type { Block } from '@blocknote/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner';

export const Route = createFileRoute('/app/content/article/update/$arId')({
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

  if (isFetching) return <div>Loading...</div>
  if (!post) return <div>No data</div>

  const { mutate } = useMutation({
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
    mutate({ id: arId, data: values })
  }

  return <PostForm
    defaultValues={{
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      isPublished: post.isPublished,
      body: JSON.parse(post.body)  || [],
      coverImage: post.coverImage ?? "",
    }}
    onSubmit={handleEdit}
  />
}
