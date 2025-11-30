import AppSettingScreen from '@/screen/setting/web'
import { createFileRoute } from '@tanstack/react-router'
import { getSettings } from '@/api/settings'

export const Route = createFileRoute('/app/setting/app/')({
  loader: ({ context }) =>
    context.queryClient.prefetchQuery({
      queryKey: ['settings'],
      queryFn: getSettings,
    }),
  component: RouteComponent,
})

function RouteComponent() {
  return <AppSettingScreen />
}
