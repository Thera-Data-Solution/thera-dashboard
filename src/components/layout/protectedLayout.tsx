import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Result, Spin, message } from 'antd';
import useAuthStore from '../../store/authStore';
import { notification } from 'antd';
import DashboardLayout from './default';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Memuat data pengguna..." />
      </div>
    );
  }

  const isAllowed = user && (user.role === 'ADMIN' || user.role === 'SU');
  if (!user || !isAllowed) {
      navigate('/403', { replace: true });

    // Kembalikan null atau elemen kosong sementara pengalihan terjadi
    return null
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

export default ProtectedRoute;