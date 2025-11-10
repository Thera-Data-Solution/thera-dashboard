import { createArticle } from '@/api/articles'
import { PostForm } from '@/components/form/post-form'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/app/content/article/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = Route.useRouteContext().queryClient
  const navigate = useNavigate()
  const { mutate } = useMutation({
    mutationFn(data: FormData) {
      return createArticle(data)
    },
    onSuccess: () => {
      toast.success("Berhasil")
      navigate({
        to: '/app/content/articles',
        replace: true
      })
      queryClient.invalidateQueries({
        queryKey: ["articles"]
      })
    },
    onError: () => toast.error("Gagal")
  })

  const handleSubmit = (values: FormData) => {
    mutate(values)
  }
  return <PostForm onSubmit={handleSubmit} />
}
