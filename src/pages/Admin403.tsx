

import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import useAuthStore from "@/store/authStore"
import { useNavigate } from "react-router-dom"

export default function Admmin403() {
    const navigate = useNavigate()
    const {logout} = useAuthStore()

    const logoutHandler = async () => {
        logout()
        navigate('/login')
    }
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    403
                </EmptyMedia>
                <EmptyTitle>Anda tidak memiliki akses</EmptyTitle>
                <EmptyDescription>
                    Anda tidak memiliki akses ke halaman ini. Silahkan hubungi administrator untuk mendapatkan akses.
                </EmptyDescription>
            </EmptyHeader>
            <Button
                variant="destructive"
                size="sm"
                onClick={logoutHandler}
            >
                Log out
            </Button>
        </Empty>
    )
}
