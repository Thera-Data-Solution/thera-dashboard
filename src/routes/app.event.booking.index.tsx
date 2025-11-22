import { getBookings } from '@/api/booking'
import BookingPage from '@/screen/event/booking'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/event/booking/')({
    loader: ({ context }) =>
        context.queryClient.prefetchQuery({
            queryKey: ['bookings'],
            queryFn: getBookings,
        }),
    component: RouteComponent,
})

function RouteComponent() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['bookings'],
        queryFn: getBookings,
    })
    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error</div>

    return <BookingPage data={data?.data || []} />
}
