import { LoginForm } from "@/components/form/login-form";
import { loginApi } from "@/api/auth";
import useAuthStore from "@/store/authStore";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { login } = useAuthStore((state) => state);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        setLoading(true);
        try {
            const { token } = await loginApi({
                email,
                password
            });

            login(token);

            toast.success("Berhasil")
            navigate('/app', { replace: true });

        } catch (error) {
            if (error instanceof AxiosError) {
                const data = error.response?.data as { error?: string; message?: string };
                const errorMessage =
                    data?.error || data?.message || 'Login gagal. Periksa kredensial Anda.';
                toast.error(errorMessage)
            } else {
                toast.error("Terjadi kesalahan pada sistem")
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm onSubmit={onSubmit} loading={loading} />
            </div>
        </div>
    )
}
