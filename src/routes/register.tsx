import { registerApi } from "@/api/auth";
import { SignupForm } from "@/components/form/register-form";
import useAuthStore from "@/store/authStore";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { GalleryVerticalEnd } from "lucide-react"
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute('/register')({
  component: SignupPage,
})

function SignupPage() {
    const login = useAuthStore((state) => state.login);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const onFinish = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            const fullName = formData.get('fullName') as string;
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;
            const confirmPassword = formData.get('confirmPassword') as string;
            if (password !== confirmPassword) {
                toast.error('Password dan konfirmasi password tidak sesuai.');
                setLoading(false);
                return;
            }

            const { token } = await registerApi({
                fullName,
                email,
                password
            });

            login(token);

            toast.success('Registrasi berhasil! Selamat datang di dashboard.');
            navigate({
                to: '/app',
                replace: true
            });

        } catch (error) {
            if (error instanceof AxiosError) {
                const data = error.response?.data as { error?: string; message?: string };
                const errorMessage =
                    data?.error || data?.message || 'Register gagal. Periksa kredensial Anda.';
                toast.error(errorMessage);
            } else {
                toast.error('Terjadi kesalahan tak terduga.');
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Acme Inc.
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <SignupForm onSubmit={onFinish} loading={loading} />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <img
                    src="/placeholder.svg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
