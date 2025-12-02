import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/app/setting/')({
    component: RouteComponent,
    loader: () => {
        throw redirect({
            to: "/app/setting/app",
        });
    }
})

function RouteComponent() {
    return <div>Loading....</div>
}
