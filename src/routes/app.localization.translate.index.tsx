
import { createFileRoute } from '@tanstack/react-router';
import Localization from '@/screen/localization';
import { Loader2 } from 'lucide-react';
import {useTranslations} from "@/hooks/translateHook.tsx";

export const Route = createFileRoute('/app/localization/translate/')({
    component: RouteComponent,
});

function RouteComponent() {
    const { data, isLoading, isError } = useTranslations();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-destructive">Gagal memuat data translations</p>
            </div>
        );
    }

    return <Localization data={data ?? []} />;
}