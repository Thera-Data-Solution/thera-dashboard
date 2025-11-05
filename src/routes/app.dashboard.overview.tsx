import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/dashboard/overview')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
        <div>
            Overview Here
            <div className="flex min-h-svh flex-col items-center justify-center">
                <Button>Click me</Button>
            </div>
        </div>
    )
}