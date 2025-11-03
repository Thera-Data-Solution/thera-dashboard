import type useAuthStore from '@/store/authStore';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

interface IContext {
  queryClient: QueryClient;
  authStore: typeof useAuthStore;
}

const RootLayout = () => (
  <div>
    <Outlet />
    <TanStackRouterDevtools />
  </div>
)

export const Route = createRootRouteWithContext<IContext>()({ component: RootLayout })