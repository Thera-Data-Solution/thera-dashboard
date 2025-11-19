import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/event/')({
  loader: () => {
    throw redirect({ to: '/app/event/categories' });
  },
});
