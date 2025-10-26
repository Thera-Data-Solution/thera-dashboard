import React from 'react';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, ConfigProvider } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

const items = [
  { key: '1', icon: <UserOutlined />, label: 'User Management' },
  { key: '2', icon: <VideoCameraOutlined />, label: 'Media' },
  { key: '3', icon: <UploadOutlined />, label: 'Upload' },
  { key: '4', icon: <SettingOutlined />, label: 'Settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userMenu = (
    <Menu
      items={[
        { key: '1', label: 'Profile', icon: <UserOutlined /> },
        { key: '2', type: 'divider' },
        { key: '3', label: 'Logout', icon: <LogoutOutlined />, danger: true },
      ]}
    />
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorText: '#1E3A8A',
          colorBgContainer: '#F8FAFC', // konten background default
        },
      }}
    >
      <Layout className="min-h-screen">
        {/* Sidebar */}
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          className="bg-blue-900 text-blue-50 sticky top-0 h-screen"
        >
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-center gap-2 bg-blue-800 p-4">
            <svg
              width="30"
              height="30"
              viewBox="0 0 55 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M35.5 0.5C45.9934 0.5 54.5 9.00659 54.5 19.5V40.5C50.0817 40.5 46.5 36.9183 46.5 32.5V19.5C46.5 13.4249 41.5751 8.5 35.5 8.5H30.2988C27.6467 8.50004 25.1029 9.55339 23.2275 11.4287L9.67188 24.9854C8.92179 25.7354 8.50006 26.7527 8.5 27.8135V28.5C8.5 30.7091 10.2909 32.5 12.5 32.5H30.5C30.5 36.7801 27.1389 40.2748 22.9121 40.4893L22.5 40.5H12.5C5.87259 40.5 0.5 35.1274 0.5 28.5V27.8135C0.500062 24.631 1.76427 21.5785 4.01465 19.3281L17.5713 5.77246C20.9469 2.39685 25.525 0.500044 30.2988 0.5H35.5Z"
                fill="#FF500B"
              />
              <path
                d="M37.5 12.5C40.2614 12.5 42.5 14.7386 42.5 17.5V40.5C38.0817 40.5 34.5 36.9183 34.5 32.5V20.5H31.1562L24.6207 27.0355C23.683 27.9732 22.4113 28.5 21.0852 28.5H12.9775C12.5588 28.5 12.3491 27.9937 12.6452 27.6976L26.3789 13.9648C27.3165 13.0272 28.588 12.5 29.9141 12.5H37.5Z"
                fill="#FF500B"
              />
            </svg>
            <span className="font-bold text-white text-lg">Panel</span>
          </div>

          {/* Menu */}
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={items}
            className="mt-2 bg-blue-900 text-blue-50"
          />
        </Sider>

        {/* Main Layout */}
        <Layout className="bg-gray-50">
          {/* Header */}
          <Header className="px-6 py-3 flex justify-end items-center shadow-md border-b border-blue-200 sticky top-0 z-10">
            <Dropdown
              overlay={userMenu}
              placement="bottomRight"
              arrow
              trigger={['click']}
            >
              <Space className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <Avatar
                  size="large"
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=Kevin"
                  className="ring-2 ring-blue-300"
                />
                <Text strong className="text-blue-900">
                  Kevin
                </Text>
              </Space>
            </Dropdown>
          </Header>

          {/* Content */}
          <Content className="m-6 p-6 bg-white rounded-xl shadow-lg min-h-[calc(100vh-160px)]">
            {children}
          </Content>

          {/* Footer */}
          <Footer className="text-center text-gray-500">
            Thera Data Solution ©{new Date().getFullYear()} Created by Kevin Adhi Krisma
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
