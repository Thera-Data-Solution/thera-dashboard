import { getUsers } from '@/api/user'
import ListUser from '@/screen/setting/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/setting/user/')({
  validateSearch: (search) => {
    return {
      page: Number(search.page) || 1
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { page } = Route.useSearch()
  const { data, isFetching } = useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsers(page),
  })
  if (isFetching) return <div>Loading</div>
  return (
    <div>
      <div className='mb-4 font-bold text-xl'>User List</div>
      <ListUser
        user={data.data || []}
        page={page}
        totalPages={data.totalPages}
        admin={false}
      />
    </div>
  )
}
