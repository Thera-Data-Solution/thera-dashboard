import { AppWindow, BookOpen, Bot, Command, Settings2, SquareTerminal, UserCog } from "lucide-react";

export const DEFAULT_MENU = [
    {
        title: "Dashboard",
        url: "/app/dashboard/overview",
        path: "/app/dashboard",
        icon: Command,
        items: [
            {
                title: "Overview",
                url: "/app/dashboard/overview",
            },
             {
                title: "User",
                url: "/app/dashboard/user",
            }
        ],
    },
    {
        title: "Playground",
        url: "#",
        icon: SquareTerminal,
        items: [
            {
                title: "History",
                url: "#",
            },
            {
                title: "Starred",
                url: "#",
            },
            {
                title: "Settings",
                url: "#",
            },
        ],
    },
    {
        title: "Models",
        url: "#",
        icon: Bot,
        items: [
            {
                title: "Genesis",
                url: "#",
            },
            {
                title: "Explorer",
                url: "#",
            },
            {
                title: "Quantum",
                url: "#",
            },
        ],
    },
    {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
            {
                title: "Introduction",
                url: "#",
            },
            {
                title: "Get Started",
                url: "#",
            },
            {
                title: "Tutorials",
                url: "#",
            },
            {
                title: "Changelog",
                url: "#",
            },
        ],
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
            {
                title: "General",
                url: "#",
            },
            {
                title: "Team",
                url: "#",
            },
            {
                title: "Billing",
                url: "#",
            },
            {
                title: "Limits",
                url: "#",
            },
        ],
    },

]


export const SUPER_ADMIN_MENU = [
    {
        name: "Tenant",
        url: "#",
        icon: AppWindow,
    },
    {
        name: "Tenant User",
        url: "#",
        icon: UserCog,
    },
]