import React, { useEffect, useState } from "react";

import { Button, Checkbox, Form, Grid, Input, notification, theme, Typography } from "antd";
import { loginApi } from '../services/auth';
import useAuthStore from '../store/authStore';

import { LockOutlined, MailOutlined, SmileOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function lOGIN() {
    const { token } = useToken();
    const [loading, setLoading] = useState<boolean>(false);
    const screens = useBreakpoint();
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const { login, user } = useAuthStore((state) => state);

    useEffect(() => {
        if (user?.id) {
            navigate('/403')
        }
    }, [user])

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
                api.open({
                    message: 'Error',
                    description: "Terjadi kesalahan pada sistem",
                    icon: <SmileOutlined style={{ color: 'red' }} />,
                });
            }
        }
        finally {
            setLoading(false);
        }
    };

    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            margin: "0 auto",
            padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
            width: "380px"
        },
        footer: {
            marginTop: token.marginLG,
            textAlign: "center",
            width: "100%"
        },
        header: {
            marginBottom: token.marginXL
        },
        section: {
            alignItems: "center",
            backgroundColor: token.colorBgContainer,
            display: "flex",
            height: screens.sm ? "100vh" : "auto",
            padding: screens.md ? `${token.sizeXXL}px 0px` : "0px"
        },
        text: {
            color: token.colorTextSecondary
        },
        title: {
            fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3
        }
    };

    return (
        <section style={styles.section}>
            {contextHolder}
            <div style={styles.container}>
                <div style={styles.header}>
                    <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect x="0.464294" width="24" height="24" rx="4.8" fill="#1890FF" />
                        <path
                            d="M14.8643 3.6001H20.8643V9.6001H14.8643V3.6001Z"
                            fill="white"
                        />
                        <path
                            d="M10.0643 9.6001H14.8643V14.4001H10.0643V9.6001Z"
                            fill="white"
                        />
                        <path
                            d="M4.06427 13.2001H11.2643V20.4001H4.06427V13.2001Z"
                            fill="white"
                        />
                    </svg>

                    <Title style={styles.title}>Sign in</Title>
                    <Text style={styles.text}>
                        Welcome back to AntBlocks UI! Please enter your details below to
                        sign in.
                    </Text>
                </div>
                <Form
                    name="normal_login"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark="optional"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: "email",
                                required: true,
                                message: "Please input your Email!",
                            },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Password!",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <a style={styles.forgotPassword} href="">
                            Forgot password?
                        </a>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: "0px" }}>
                        <Button block type="primary" htmlType="submit" loading={loading}>
                            Log in
                        </Button>
                        <div style={styles.footer}>
                            <Text style={styles.text}>Don't have an account?</Text>{" "}
                            <Link href="/register">Sign up now</Link>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </section>
    );
}
