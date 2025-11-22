import { getHero } from '@/api/hero'
import { HeroManagement } from '@/screen/content/hero'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/content/hero/')({
  loader: ({ context }) =>
    context.queryClient.prefetchQuery({
      queryKey: ["hero"],
      queryFn: getHero,
    }),
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["hero"],
    queryFn: getHero,
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <HeroManagement
        data={data ?? {
          title: "",
          subtitle: "",
          description: "",
          buttonText: "",
          buttonLink: "",
          themeType: "",
          image: ""
        }}
      />
    </>
  )
}
