import { userContext } from "@/context/useUserContext";
import useAuthStore from "@/store/authStore";
import { redirect } from "react-router-dom";

export async function redRoutes({ context }: { context: any }) {
    const { user } = useAuthStore.getState();

    

    if (!user) {
        return redirect('/login');
    }

    if (user && (user.role !== 'ADMIN' && user.role !== 'SU')) {
        return redirect('/403');
    }

    context.set(userContext, user);
}