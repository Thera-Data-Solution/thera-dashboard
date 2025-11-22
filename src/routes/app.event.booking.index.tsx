import { getBookings } from '@/api/booking'
import BookingPage from '@/screen/event/booking'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {Skeleton} from "@/components/ui/skeleton.tsx";

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
    if (isLoading) {
        return (
            <div>
                <Skeleton className="h-[30px] w-[300px] rounded-md" />
                <Skeleton className={"w-full h-[200px] mt-8"} />
            </div>
        )
    }
    if (isError) return <div>Error</div>

    return <BookingPage data={data?.data || []} />
}
