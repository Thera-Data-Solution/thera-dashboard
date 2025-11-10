import './index.css'

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { routeTree } from './routeTree.gen'
import { Toaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useAuthStore from './store/authStore'

// Create a new router instance
const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 24, // 24 jam (tidak dianggap usang)
        gcTime: 1000 * 60 * 60 * 24,    // 24 jam (garbage collect setelah 24 jam)
      },
    },
  }
)

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    authStore: undefined!,
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})


// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function MainApp() {
  const authStore = useAuthStore;
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ queryClient, authStore }} />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  )
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <MainApp />
    </StrictMode>,
  )
}