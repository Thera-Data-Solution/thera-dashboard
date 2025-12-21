import {
  Command,
  CalendarCheck,
  Tags,
  CalendarDays,
  ClipboardList,
  MessageSquare,
  Newspaper,
  ImageIcon,
  Monitor,
  Link2,
  Globe,
  Cog,
  Users,
  ListChecks,
  FileText,
  LinkIcon,
  Settings,
  AppWindow,
  UserCog
} from "lucide-react";

export const DEFAULT_MENU = [
  // Dashboard
  {
    title: "Overview",
    url: "/app/dashboard/overview/",
    path: "/app/dashboard",
    icon: Command,
    type: "all",
  },

  // Event Management
  {
    title: "Schedule Categories",
    url: "/app/event/categories",
    path: "/app/event",
    icon: Tags, // kategori
    type: "event",
  },
  {
    title: "Schedule",
    url: "/app/event/schedules",
    path: "/app/event",
    icon: CalendarDays, // jadwal
    type: "event",
  },
  {
    title: "Bookings",
    url: "/app/event/booking",
    path: "/app/event",
    icon: CalendarCheck, // booking
    type: "event",
  },
  {
    title: "Reviews",
    url: "/app/event/review",
    path: "/app/event",
    icon: MessageSquare, // review
    type: "event",
  },

  // Content Management
  {
    title: "Articles",
    url: "/app/content/articles",
    path: "/app/content",
    icon: Newspaper,
    type: "content",
  },
  {
    title: "Gallery",
    url: "/app/content/gallery",
    path: "/app/content",
    icon: ImageIcon,
    type: "content",
  },
  {
    title: "Hero Section",
    url: "/app/content/hero",
    path: "/app/content",
    icon: Monitor,
    type: "content",
  },
  {
    title: "Social Links",
    url: "/app/content/social",
    path: "/app/content",
    icon: Link2,
    type: "content",
  },

  // Localization
  {
    title: "Translations",
    url: "/app/localization/translate",
    path: "/app/localization",
    icon: Globe,
    type: "translation",
  },

  // Settings
  {
    title: "Landing Settings",
    url: "/app/setting/app",
    path: "/app/setting",
    icon: Cog,
    type: "website",
  },
  {
    title: "Previous Collaborators",
    url: "/app/setting/partner",
    path: "/app/setting",
    icon: LinkIcon,
    type: "website",
  },
  // System Management
  {
    title: "User Management",
    url: "/app/system/user",
    path: "/app/system",
    icon: Users,
    type: "system",
  }
];


export const SUPER_ADMIN_MENU = [
  {
    name: "All Schedule Categories",
    url: "/app/admin/categories",
    icon: ListChecks,
  },
  {
    name: "All Schedules",
    url: "/app/admin/schedules",
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
    url: "/app/admin/tenant",
    icon: AppWindow,
  },
  {
    name: "Tenant Users",
    url: "/app/admin/tenant-user",
    icon: UserCog,
  },
];