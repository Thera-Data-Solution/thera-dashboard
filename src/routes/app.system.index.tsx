import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/system/')({
  component: RouteComponent,
   loader: () => {
        throw redirect({
            to: "/app/system/user",
            search: {
                page: 1
            },
        });
    }
})

function RouteComponent() {
    return <div>Loading....</div>
}
