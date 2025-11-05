import {
    AppWindow,
    CalendarCheck,
    CalendarRange,
    ClipboardList,
    Cog,
    Command,
    FileText,
    Globe,
    ImageIcon,
    LinkIcon,
    ListChecks,
    MessageSquare,
    Monitor,
    Newspaper,
    Settings,
    UserCog,
    Users
}
    from "lucide-react";

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
            }
        ],
    },
    {
        title: "Event Management",
        url: "/app/event/categories",
        icon: CalendarRange,
        items: [
            {
                title: "Schedule Categories",
                url: "/app/event/categories",
            },
            {
                title: "Schedule",
                url: "#",
            },
            {
                title: "Bookings",
                url: "#",
            },
            {
                title: "Reviews",
                url: "#",
            }
        ],
    },
    {
        title: "Content Management",
        url: "#",
        icon: Newspaper,
        items: [
            {
                title: "Articles",
                url: "#",
            },
            {
                title: "Gallery",
                url: "#",
            },
            {
                title: "Hero Section",
                url: "#",
            },
            {
                title: "Footer Links",
                url: "#",
            },
        ],
    },
    {
        title: "Localization",
        url: "#",
        icon: Globe,
        items: [
            {
                title: "Translations",
                url: "#",
            },
        ],
    },
    {
        title: "Settings",
        url: "#",
        icon: Cog,
        items: [
            {
                title: "Landing Settings",
                url: "#",
            },
            {
                title: "Users",
                url: "#",
            },
        ],
    },

]


export const SUPER_ADMIN_MENU = [
  {
    name: "All Schedule Categories",
    url: "/dashboard/all-schedule-categories",
    icon: ListChecks,
  },
  {
    name: "All Schedules",
    url: "/dashboard/all-schedules",
    icon: CalendarCheck,
  },
  {
    name: "All Bookings",
    url: "/dashboard/all-bookings",
    icon: ClipboardList,
  },
  {
    name: "All Reviews",
    url: "/dashboard/all-reviews",
    icon: MessageSquare,
  },
  {
    name: "All Articles",
    url: "/dashboard/all-articles",
    icon: FileText,
  },
  {
    name: "All Gallery",
    url: "/dashboard/all-gallery",
    icon: ImageIcon,
  },
  {
    name: "All Hero Section",
    url: "/dashboard/all-hero",
    icon: Monitor,
  },
  {
    name: "All Footer Links",
    url: "/dashboard/all-footer-links",
    icon: LinkIcon,
  },
  {
    name: "All Translations",
    url: "/dashboard/all-translations",
    icon: Globe,
  },
  {
    name: "All Landing Settings",
    url: "/dashboard/all-landing-settings",
    icon: Settings,
  },
  {
    name: "All Users",
    url: "/dashboard/all-users",
    icon: Users,
  },
  {
    name: "Tenants",
    url: "/dashboard/tenants",
    icon: AppWindow,
  },
  {
    name: "Tenant Users",
    url: "/dashboard/tenant-users",
    icon: UserCog,
  },
];