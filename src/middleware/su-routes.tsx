import { userContext } from "@/context/useUserContext";
import useAuthStore from "@/store/authStore";
import { redirect } from "react-router-dom";

export async function suRoutes({ context }: { context: any }) {
  const { user } = useAuthStore.getState();

  if (!user) {
    throw redirect("/login");
  }

  if (user && user.role !== 'SU') {
    return redirect("/app");
  }

  context.set(userContext, user);
}
