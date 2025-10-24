// src/pages/Login.tsx
import React, { useState } from 'react';
import { Button, Form, Input, Card, message } from 'antd';
import { UserOutlined, LockOutlined, SmileOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { loginApi } from '../services/auth';
import { AxiosError } from 'axios';
import { notification } from 'antd';

const Login: React.FC = () => {
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    // Ambil action 'login' dari Zustand store
    const login = useAuthStore((state) => state.login);
    const [loading, setLoading] = useState<boolean>(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Panggil API Login dengan Axios
            const { token } = await loginApi(values);

            // Simpan token ke Zustand store
            login(token);

            api.open({
                message: 'Success',
                description: "Berhasil",
                icon: <SmileOutlined style={{ color: '#108ee9' }} />,
            });
            navigate('/dashboard', { replace: true });

        } catch (error) {
            if (error instanceof AxiosError) {
                const data = error.response?.data as { error?: string; message?: string };
                const errorMessage =
                    data?.error || data?.message || 'Login gagal. Periksa kredensial Anda.';
                api.open({
                    message: 'Error',
                    description: errorMessage,
                    icon: <SmileOutlined style={{ color: 'red' }} />,
                });
            } else {
                message.error('Terjadi kesalahan tak terduga.');
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {contextHolder}
            <Card title="Login ke Akun Anda" className="w-full max-w-md shadow-lg">
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Mohon masukkan email', type: 'email' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="email" />
                    </Form.Item>

                    <Form.Item
                        label="Password (coba: 123456)"
                        name="password"
                        rules={[{ required: true, message: 'Mohon masukkan password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
                <div className="text-center">
                    Belum punya akun? <Link to="/register" className="text-blue-500 hover:text-blue-700">Daftar sekarang</Link>
                </div>
            </Card>
        </div>
    );
};

export default Login;