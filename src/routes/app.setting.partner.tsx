import Partner from '@/screen/setting/partner'
import {createFileRoute} from '@tanstack/react-router'
import {useQuery} from "@tanstack/react-query";
import {getPartners} from "@/api/partner";

export const Route = createFileRoute('/app/setting/partner')({
    component: RouteComponent,
})

function RouteComponent() {
    const {data: partners, isPending} = useQuery({
        queryKey: ['partners'],
        queryFn: () => getPartners()
    })
    if (isPending) return <div>Loading...</div>;
    return <Partner ix={partners.data || []}/>
}
