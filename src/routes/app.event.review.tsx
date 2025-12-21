import { getBookings } from '@/api/booking'
import ShowReview from '@/screen/event/review'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/event/review')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.prefetchQuery({
      queryKey: ['bookings'],
      queryFn: getBookings,
    }),
})

function RouteComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  })
  if (isLoading) return <div>Loading....</div>
  return (
    <div>
      <ShowReview data={data.data || []} />
    </div>
  )
}
