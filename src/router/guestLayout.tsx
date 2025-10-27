import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function GuestLayout() {
    const navigate = useNavigate();
    const {user} = useAuthStore((state) => state);

    useEffect(() => {
        if (user) {
            navigate('/app', { replace: true });
        }
    }, [user, navigate]);


    return (
        <div>
            <Outlet />
        </div>
    );
}

