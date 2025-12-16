import { LoadScreen } from '@/components/loadingScreen';
import type useAuthStore from '@/store/authStore';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Outlet, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface IContext {
  queryClient: QueryClient;
  authStore: typeof useAuthStore;
}

function GlobalLoading() {
  const isLoading = useRouterState({
    select: (s) => s.isLoading,
  })

  const [show, setShow] = useState(false)

  // Tambahkan sedikit delay biar UX lebih halus
  useEffect(() => {
    if (isLoading) {
      const t = setTimeout(() => setShow(true), 150)
      return () => clearTimeout(t)
    } else {
      setShow(false)
    }
  }, [isLoading])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center text-white">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <span className="text-sm font-medium">Memuat halaman...</span>
      </div>
    </div>
  )
}

const RootLayout = () => (
  <div>
    <HeadContent/>
    <Outlet />
      <GlobalLoading />
    <TanStackRouterDevtools />
  </div>
)

export const Route = createRootRouteWithContext<IContext>()({ component: RootLayout, pendingComponent: () => <LoadScreen title='Loading' /> })