import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import useAuthStore from '../../store/authStore';
import { notification } from 'antd';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const { token, user, fetchUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const verifyUser = async () => {
      // 1. Periksa Token
      if (!token) {
        setLoading(false);
        navigate('/login', { replace: true });
        return;
      }

      // 2. Ambil Data Pengguna
      try {
        await fetchUser();
      } catch (err) {
        message.error('Sesi Anda telah berakhir. Silakan login kembali.');
        logout();
        navigate('/login', { replace: true });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, [token, fetchUser, logout, navigate]);

  // Bagian ini dijalankan setelah proses di useEffect selesai

  // --- Pengecekan Akses ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Memuat data pengguna..." />
      </div>
    );
  }

  // 3. Periksa Peran Pengguna (Implementasi baru)
  const isAllowed = user && (user.role === 'ADMIN' || user.role === 'SU');
  if (!user || !isAllowed) {
    api.open({
      message: 'Akses ditolak',
      description: 'Hanya pengguna dengan peran ADMIN yang diizinkan.',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
    // Anda bisa mengarahkan ke halaman 403 (Forbidden) atau halaman utama
    navigate('/', { replace: true });

    // Kembalikan null atau elemen kosong sementara pengalihan terjadi
    return null;
  }

  // 4. Izinkan Akses
  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default ProtectedRoute;