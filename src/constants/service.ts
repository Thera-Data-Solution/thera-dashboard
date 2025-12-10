import { BookUp, Cog, Globe, Newspaper, Settings, type LucideIcon } from "lucide-react";

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
        label: "Event",
        type: "event"
    },
    {
        location: '/app/content',
        icon: Newspaper,
        class: "bg-gradient-to-br from-amber-400 to-orange-600",
        label: "Content",
        type: "content"
    },
    {
        location: '/app/localization',
        icon: Globe,
        class: "bg-gradient-to-br from-emerald-400 to-teal-600",
        label: "Localization",
        type: "translation"
    },
    {
        location: '/app/setting',
        icon: Cog,
        class: "bg-gradient-to-br from-red-400 to-blue-600",
        label: "Web",
        type: "website"
    },
    {
        location: "/app/system",
        icon: Settings,
        class: "bg-gradient-to-br from-gray-500 to-gray-700",
        label: "System",
        type: "system"
    }
]