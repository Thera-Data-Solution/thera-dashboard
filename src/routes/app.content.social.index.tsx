import { getLinks } from '@/api/link'
import SocialLink from '@/screen/content/social'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/content/social/')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.prefetchQuery({
      queryKey: ['links'],
      queryFn: getLinks,
    }),
})

function RouteComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['links'],
    queryFn: getLinks,
  })
  if (isLoading) return <div>Loading....</div>
  return <SocialLink data={data} />
}
