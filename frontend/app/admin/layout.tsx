"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Layout, Menu, Avatar, Dropdown, Button, Spin } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  const auth = useSelector((state: RootState) => state.auth);
  const user = auth?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!auth?.isAuthenticated || user?.role !== "admin")) {
      router.push("/login");
    }
  }, [mounted, auth?.isAuthenticated, user?.role, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link href="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: <Link href="/admin/products">Products</Link>,
    },
    {
      key: "/admin/categories",
      icon: <FileTextOutlined />,
      label: <Link href="/admin/categories">Categories</Link>,
    },
    {
      key: "/admin/orders",
      icon: <FileTextOutlined />,
      label: <Link href="/admin/orders">Orders</Link>,
    },
    {
      key: "/admin/customers",
      icon: <UserOutlined />,
      label: <Link href="/admin/customers">Customers</Link>,
    },
    {
      key: "/admin/reviews",
      icon: <FileTextOutlined />,
      label: <Link href="/admin/reviews">Reviews</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      label: <Link href="/profile">Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: <Link href="/admin/settings">Settings</Link>,
      icon: <SettingOutlined />,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!auth?.isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} className="bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            {!collapsed && <span className="text-lg font-bold text-gray-900">Admin</span>}
          </div>
        </div>
        <Menu mode="inline" selectedKeys={[pathname]} items={menuItems} className="border-0" />
      </Sider>
      <Layout>
        <Header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg"
          />
          <div className="flex items-center space-x-4">
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" className="flex items-center space-x-2">
                <Avatar size="small" className="bg-blue-600">
                  {user?.firstName?.charAt(0)?.toUpperCase() || "A"}
                </Avatar>
                <span className="hidden sm:block">
                  {user?.firstName} {user?.lastName}
                </span>
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm">{children}</Content>
      </Layout>
    </Layout>
  );
}
