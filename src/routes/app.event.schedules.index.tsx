import { getCategories } from '@/api/categories';
import { getSchedules } from '@/api/schedules';
import { EmptyDemo } from '@/components/emptyScreen';
import { LoadScreen } from '@/components/loadingScreen';
import SchedulesPage from '@/screen/event/calendar'
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/event/schedules/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories
  });
  const { data: schedules, isLoading: isLoad } = useQuery({
    queryKey: ["schedules"],
    queryFn: getSchedules
  });
  if (isLoading || isLoad) {
    return (
      <LoadScreen title='Schedules and categories' />
    )
  }

  if (categories.length === 0) {
    return <EmptyDemo title={'Category'} url={'/app/event/categories/new'} />
  }
  return (
    <SchedulesPage schedules={schedules || []} categories={categories || []} timezone={'Asia/Jakarta'} />
  )
}
