import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Outlet, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import useAuthStore from "@/store/authStore"
import { toast } from "sonner"
import { TSRBreadCrumbs } from "../TSRBreadCrumbs"

export default function Layout() {
  const navigate = useNavigate()
  const { token, fetchUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

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

  if(loading){
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
           <TSRBreadCrumbs />
          </div>
        </header>
        <div className="p-4">

          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
