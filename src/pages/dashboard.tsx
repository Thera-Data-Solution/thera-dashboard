import React from 'react';
import { Card, Button, Typography, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    message.success('Anda berhasil logout.');
    navigate('/login', { replace: true });
  };

  if (!user) {
    // Antisipasi jika ProtectedRoute belum sempat fetch (jarang terjadi)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Title level={2} className="text-gray-800">Halaman Dashboard</Title>

      <Card className="shadow-md bg-white">
        <Title level={4}>
          Selamat Datang, <strong>{user.fullName}</strong>!
        </Title>

        <Text className="block mb-4">
          Anda berhasil login. Informasi pengguna ini diambil dari endpoint <code>/me</code>.
        </Text>

        <Space direction="vertical" className="w-full" size="middle">
          <Text strong>ID Pengguna:</Text>
          <Text code>{user.id}</Text>

          <Text strong>Email:</Text>
          <Text>{user.email}</Text>

          <Text strong>Role:</Text>
          <Text>{user.role || 'User Biasa'}</Text>

          <Text strong>Session Token Anda:</Text>
          <div className="break-all p-3 bg-gray-100 rounded border border-dashed border-gray-300">
            <Text code>{token}</Text>
          </div>

          <Button type="primary" danger onClick={handleLogout} className="mt-4">
            Logout
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard;
