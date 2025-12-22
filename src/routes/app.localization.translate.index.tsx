
import { createFileRoute } from '@tanstack/react-router';
import Localization from '@/screen/localization';

export const Route = createFileRoute('/app/localization/translate/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <Localization />;
}