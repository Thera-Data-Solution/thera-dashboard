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
                url: "/app/dashboard/overview/",
            }
        ],
    },
    {
        title: "Event Management",
        url: "/app/event/categories",
        path: "/app/event",
        icon: CalendarRange,
        items: [
            {
                title: "Schedule Categories",
                url: "/app/event/categories",
            },
            {
                title: "Schedule",
                url: "/app/event/schedules",
            },
            {
                title: "Bookings",
                url: "/app/event/booking",
            },
            {
                title: "Reviews",
                url: "#",
            }
        ],
    },
    {
        title: "Content Management",
        url: "/app/content/articles",
        path: "/app/content",
        icon: Newspaper,
        items: [
            {
                title: "Articles",
                url: "/app/content/articles",
            },
            {
                title: "Gallery",
                url: "/app/content/gallery",
            },
            {
                title: "Hero Section",
                url: "/app/content/hero",
            },
            {
                title: "Social Links",
                url: "/app/content/social",
            },
        ],
    },
    {
        title: "Localization",
        url: "/app/localization/translate",
        path: "/app/localization",
        icon: Globe,
        items: [
            {
                title: "Translations",
                url: "/app/localization/translate",
            },
        ],
    },
    {
        title: "Settings",
        url: "/app/setting/app/",
        path: "/app/setting",
        icon: Cog,
        items: [
            {
                title: "Landing Settings",
                url: "/app/setting/app",
            },
            {
                title: "Users",
                url: "/app/setting/user",
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
    url: "/app/admin/user",
    icon: Users,
  },
  {
    name: "Tenants",
    url: "/dashboard/tenants",
    icon: AppWindow,
  },
  {
    name: "Tenant Users",
    url: "/app/admin/tenant",
    icon: UserCog,
  },
];