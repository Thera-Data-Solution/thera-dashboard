// src/pages/Register.tsx
import React, { useState } from 'react';
import { Button, Form, Input, Card, message } from 'antd';
import { UserOutlined, LockOutlined, SmileOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { registerApi } from '../services/auth';
import { AxiosError } from 'axios';
import { notification } from 'antd';

const Register: React.FC = () => {
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();
    // Ambil action 'login' dari Zustand store
    const login = useAuthStore((state) => state.login);
    const [loading, setLoading] = useState<boolean>(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // Panggil API Register dengan Axios
            const { token } = await registerApi({
                email: values.email,
                password: values.password,
                fullName: values.fullName
            });

            // Simpan token ke Zustand store
            login(token);

            api.open({
                message: 'Success',
                description: "Registrasi Berhasil",
                icon: <SmileOutlined style={{ color: 'green' }} />,
            });
            navigate('/dashboard', { replace: true });

        } catch (error) {
            if (error instanceof AxiosError) {
                const data = error.response?.data as { error?: string; message?: string };
                const errorMessage =
                    data?.error || data?.message || 'Register gagal. Periksa kredensial Anda.';
                api.open({
                    message: 'Error',
                    description: errorMessage,
                    icon: <SmileOutlined style={{ color: 'red' }} />,
                });
            } else {
                message.error('Terjadi kesalahan tak terduga.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {contextHolder}
            <Card title="Register Akun Baru" className="w-full max-w-md shadow-lg">
                <Form
                    name="register"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Display Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Mohon masukkan fullname!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Fullname" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Mohon masukkan email!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Mohon masukkan password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        label="Konfirmasi Password"
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Mohon konfirmasi password Anda!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Konfirmasi password tidak cocok!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Konfirmasi Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
                <div className="text-center">
                    Sudah punya akun? <Link to="/login" className="text-blue-500 hover:text-blue-700">Login di sini</Link>
                </div>
            </Card>
        </div>
    );
};

export default Register;