
import { Link, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { LoadScreen } from "@/components/loadingScreen"
import { Bell, CreditCard, Search } from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Route } from "@/routes/dashboard"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { SERVICE_ITEM, type ItemInterface } from "@/constants/service"
import { APP_VERSION } from "@/constants/config"



export default function FirstApp() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const { user, token, fetchUser, logout } = Route.useRouteContext().authStore.getState();

    const loggingOut = () => {
        logout()
        navigate({
            to: '/',
            replace: true
        })
        window.location.href = '/'
        window.location.reload()
    }

    useEffect(() => {
        let isMounted = true;

        const verifyUser = async () => {
            // 1. Periksa Token
            if (!token) {
                setLoading(false);
                navigate({
                    to: '/',
                    replace: true
                });
                return;
            }

            // 2. Ambil Data Pengguna
            try {
                await fetchUser();
            } catch (err) {
                console.error(err);
                toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
                logout();
                navigate({
                    to: '/',
                    replace: true
                });
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        verifyUser();

        return () => {
            isMounted = false;
        };
    }, [token, fetchUser, logout, navigate]);

    if (loading) {
        return <LoadScreen title="Loading" />
    }
    return (
        <div className="min-h-screen bg-[#383b53] flex flex-col font-sans relative overflow-hidden">
            <header className="w-full">
                <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">

                    {/* LEFT */}
                    <div className="text-lg font-semibold text-white">
                        Therasystem
                    </div>

                    {/* CENTER */}
                    <div className="hidden md:flex w-full max-w-md mx-6">
                        <div className="relative w-full">
                            <Input
                                placeholder="Cari..."
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">
                        {/* Search icon on mobile */}
                        <Button className="md:hidden p-2 rounded-md hover:bg-slate-100">
                            <Search className="w-5 h-5" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="bg-primary w-full h-full p-1 rounded-full flex items-center">
                                    <Avatar className="h-4 w-4 rounded-lg items-center">
                                        <AvatarImage src={user?.avatar} alt={user?.fullName} />
                                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                    </Avatar>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="bottom" className="w-56" align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={user?.avatar} alt={user?.fullName} />
                                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                        </Avatar>
                                        <div className="grid">
                                            <span className="truncate font-medium">{user?.fullName}</span>
                                            <span className="truncate text-xs">{user?.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <CreditCard />
                                    Billing
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Bell />
                                    Notifications
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={loggingOut}>
                                    Log out
                                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 -mt-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-12 gap-y-12">
                    {SERVICE_ITEM.map((item: ItemInterface) => (
                        <Link
                            to={item.location}
                            className="group flex flex-col items-center gap-4 outline-none"
                        >
                            <div className={`w-[100px] h-[100px] ${item.class} rounded-[24px] shadow-2xl shadow-orange-900/30 flex items-center justify-center text-white group-hover:scale-105 group-hover:shadow-orange-500/40 group-focus:ring-4 ring-orange-500/30 transition-all duration-300 relative border-t border-white/20`}>
                                <item.icon size={42} strokeWidth={1.5} className="drop-shadow-sm" />
                                {/* <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold h-6 min-w-[24px] px-1.5 flex items-center justify-center rounded-full border-4 border-[#383b53] shadow-sm">5</div> */}
                            </div>
                            <span className="text-slate-200 font-medium text-lg tracking-wide group-hover:text-white transition-colors drop-shadow-md">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </main>
            <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-white/20 text-sm font-medium">Thera Platform {APP_VERSION}</p>
            </div>
        </div >
    )
}
