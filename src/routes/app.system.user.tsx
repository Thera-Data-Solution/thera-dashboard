import { getUsers } from '@/api/user'
import ListUser from '@/screen/setting/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/system/user')({
  validateSearch: (search) => ({
    page: Number(search.page) || 1,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { page } = Route.useSearch()
  const navigate = Route.useNavigate()

  const { data, isFetching } = useQuery({
    queryKey: ["users", page],
    queryFn: () => getUsers(page),
  })

  if (isFetching) return <div>Loading...</div>

  return (
    <ListUser
      user={data.data || []}
      page={page}
      totalPages={data.totalPages}
      admin={false}
      onPageChange={(p) =>
        navigate({ search: { page: p } })
      }
    />
  )
}
