import { Button, Result } from "antd";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function AdminFourZeroThree() {
    const { logout } = useAuthStore()
    const navigate = useNavigate()
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Result
                status="403"
                title="Akses Ditolak"
                subTitle="Hanya pengguna dengan peran ADMIN yang diizinkan untuk mengakses halaman ini."
                extra={
                    <Button
                        type="primary"
                        danger
                        size="large"
                        onClick={() => {
                            logout();
                            navigate('/login', { replace: true });
                        }}
                    >
                        Logout dan Kembali ke Login
                    </Button>
                }
            />
        </div>
    )
}