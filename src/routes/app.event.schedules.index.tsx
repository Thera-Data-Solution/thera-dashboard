import { getCategories } from '@/api/categories';
import { getSchedules } from '@/api/schedules';
import { EmptyDemo } from '@/components/emptyScreen';
import { LoadScreen } from '@/components/loadingScreen';
import SchedulesPage from '@/screen/event/calendar';
import { queryOptions } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: getCategories,
});

const schedulesQuery = queryOptions({
  queryKey: ["schedules"],
  queryFn: getSchedules,
});

export const Route = createFileRoute('/app/event/schedules/')({
  loader: async ({ context }) => {
    // Pastikan dua-duanya di-fetch dan tersimpan ke Query Cache
    const [categories, schedules] = await Promise.all([
      context.queryClient.ensureQueryData(categoriesQuery),
      context.queryClient.ensureQueryData(schedulesQuery)
    ]);

    return { categories, schedules };
  },

  component: RouteComponent,
});

function RouteComponent() {
  const { categories, schedules } = Route.useLoaderData();

  if (!categories || !schedules) {
    return <LoadScreen title="Schedules and categories" />;
  }

  if (categories.length === 0) {
    return <EmptyDemo title="Category" url="/app/event/categories/new" />;
  }

  return (
    <SchedulesPage
      schedules={schedules}
      categories={categories}
      timezone="Asia/Jakarta"
    />
  );
}
