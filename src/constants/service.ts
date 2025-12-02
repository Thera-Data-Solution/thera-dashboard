import { BookUp, Cog, Globe, Newspaper, type LucideIcon } from "lucide-react";

export interface ItemInterface {
    location: string
    icon: LucideIcon
    class: string
    label: string
}

export const SERVICE_ITEM = [
    {
        location: '/app/event',
        icon: BookUp,
        class: "bg-gradient-to-br from-fuchsia-500 to-purple-600",
        label: "Event"
    },
    {
        location: '/app/content',
        icon: Newspaper,
        class: "bg-gradient-to-br from-amber-400 to-orange-600",
        label: "Content"
    },
    {
        location: '/app/localization',
        icon: Globe,
        class: "bg-gradient-to-br from-emerald-400 to-teal-600",
        label: "Localization"
    },
    {
        location: '/app/setting',
        icon: Cog,
        class: "bg-gradient-to-br from-red-400 to-blue-600",
        label: "Web"
    }
]