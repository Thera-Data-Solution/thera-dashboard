import { createFileRoute, redirect } from "@tanstack/react-router"
import { LoginForm } from "@/components/form/login-form";
import { loginApi } from "@/api/auth";
import useAuthStore from "@/store/authStore";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { HoleBackground } from "@/components/animate-ui/components/backgrounds/hole";


export const Route = createFileRoute('/')({
    loader: ({ context }) => {
        const { authStore } = context;
        const { token, isLoggedIn } = authStore.getState();

        if (token && isLoggedIn) {
            throw redirect({
                to: '/app',
                replace: true,
            });
        }
    },
    component: LoginPage,
});

function LoginPage() {
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore((state) => state);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        setLoading(true);
        try {
            const { token } = await loginApi({ email, password });
            login(token);
            toast.success("Berhasil login");
            window.location.href = "/app"; // ✅ lebih cepat dan aman setelah login
        } catch (error) {
            if (error instanceof AxiosError) {
                const data = error.response?.data as { error?: string; message?: string };
                const msg = data?.error || data?.message || "Login gagal. Periksa kredensial Anda.";
                toast.error(msg);
            } else {
                toast.error("Terjadi kesalahan pada sistem");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">

            <HoleBackground className="absolute inset-0 flex items-center justify-center rounded-xl z-0" />
            <div className="w-full max-w-sm">
                <LoginForm onSubmit={onSubmit} loading={loading} />
            </div>
        </div>
    );
}
