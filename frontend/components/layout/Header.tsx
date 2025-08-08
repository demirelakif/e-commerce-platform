"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { toggleCartDrawer, toggleSearchModal } from "@/store/slices/uiSlice";
import { logout } from "@/store/slices/authSlice";
import {
  ShoppingCartOutlined,
  SearchOutlined,
  UserOutlined,
  MenuOutlined,
  HeartOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Badge, Input, Drawer, List, Avatar } from "antd";
import { useRouter } from "next/navigation";

const { Search } = Input;

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const auth = useSelector((state: RootState) => state.auth);
  const cart = useSelector((state: RootState) => state.cart);
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user || null;
  const itemCount = cart?.itemCount || 0;

  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/products?search=${encodeURIComponent(value.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const userMenuItems = [
    {
      key: "profile",
      label: (
        <Link href="/profile" className="flex items-center">
          Profile
        </Link>
      ),
      icon: <UserOutlined />,
    },
    {
      key: "orders",
      label: (
        <Link href="/orders" className="flex items-center">
          My Orders
        </Link>
      ),
    },
    {
      key: "wishlist",
      label: (
        <Link href="/wishlist" className="flex items-center">
          Wishlist
        </Link>
      ),
      icon: <HeartOutlined />,
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

  const adminMenuItems = [
    {
      key: "dashboard",
      label: (
        <Link href="/admin" className="flex items-center">
          Dashboard
        </Link>
      ),
    },
    {
      key: "products",
      label: (
        <Link href="/admin/products" className="flex items-center">
          Products
        </Link>
      ),
    },
    {
      key: "orders",
      label: (
        <Link href="/admin/orders" className="flex items-center">
          Orders
        </Link>
      ),
    },
    {
      key: "customers",
      label: (
        <Link href="/admin/customers" className="flex items-center">
          Customers
        </Link>
      ),
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

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">E-Commerce</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 ml-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <Search
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              size="large"
              className="w-full"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Button (Mobile) */}
            <Button
              type="text"
              icon={<SearchOutlined />}
              onClick={() => dispatch(toggleSearchModal())}
              className="lg:hidden"
              size="large"
            />

            {/* Cart */}
            <Button
              type="text"
              icon={
                <Badge count={itemCount} size="small" offset={[-8, 8]} className="cart-badge">
                  <ShoppingCartOutlined className="text-xl" />
                </Badge>
              }
              onClick={() => dispatch(toggleCartDrawer())}
              size="large"
              className="relative flex items-center justify-center"
            />

            {/* User Menu */}
            {isAuthenticated ? (
              <Dropdown
                menu={{
                  items: user?.role === "admin" ? adminMenuItems : userMenuItems,
                }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button type="text" className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <Avatar size="small" className="bg-blue-600">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name || "User"}</span>
                  <DownOutlined className="text-xs" />
                </Button>
              </Dropdown>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button type="text" size="large" className="font-medium">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button type="primary" size="large" className="font-medium">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden"
              size="large"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer title="Menu" placement="right" onClose={() => setMobileMenuOpen(false)} open={mobileMenuOpen} width={280}>
        <div className="space-y-4">
          {/* Mobile Navigation */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Navigation</h3>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Search */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Search</h3>
            <Search placeholder="Search products..." onSearch={handleSearch} enterButton={<SearchOutlined />} size="large" />
          </div>

          {/* User Actions */}
          {isAuthenticated ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Account</h3>
              <div className="space-y-1">
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Account</h3>
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-2 text-base font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </Drawer>
    </header>
  );
}
