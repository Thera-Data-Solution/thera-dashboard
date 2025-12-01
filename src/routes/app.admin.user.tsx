import { AdminGetUsers } from '@/api/user'
import ListUser from '@/screen/setting/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/admin/user')({
    validateSearch: (search) => {
        return {
            page: Number(search.page) || 1
        }
    },
    loaderDeps: ({ search: { page } }) => ({ page }),
    loader: ({ context, deps: { page } }) => {
        context.queryClient.prefetchQuery({
            queryKey: ["admin-users", page],
            queryFn: () => AdminGetUsers(page),
        })
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { page } = Route.useSearch()
    const navigate = Route.useNavigate()
    const { data, isFetching } = useQuery({
        queryKey: ['admin-users', page],
        queryFn: () => AdminGetUsers(page),
    })
    if (isFetching) return <div>Loading</div>
    return (
        <div>
            <div className='mb-4 font-bold text-xl'>User List</div>
            <ListUser
                user={data.data || []}
                page={page}
                totalPages={data.totalPages}
                admin={true}
                onPageChange={(p) =>
                    navigate({ search: { page: p } })
                }
            />
        </div>
    )
}
