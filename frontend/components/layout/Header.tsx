'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleCartDrawer, toggleSearchModal } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { 
  ShoppingCartOutlined, 
  SearchOutlined, 
  UserOutlined, 
  MenuOutlined,
  HeartOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Badge, Input } from 'antd';
import { useRouter } from 'next/navigation';

const { Search } = Input;

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { itemCount } = useSelector((state: RootState) => state.cart);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: <Link href="/profile">Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      key: 'orders',
      label: <Link href="/orders">My Orders</Link>,
    },
    {
      key: 'wishlist',
      label: <Link href="/wishlist">Wishlist</Link>,
      icon: <HeartOutlined />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const adminMenuItems = [
    {
      key: 'dashboard',
      label: <Link href="/admin">Dashboard</Link>,
    },
    {
      key: 'products',
      label: <Link href="/admin/products">Products</Link>,
    },
    {
      key: 'orders',
      label: <Link href="/admin/orders">Orders</Link>,
    },
    {
      key: 'customers',
      label: <Link href="/admin/customers">Customers</Link>,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            E-Commerce
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <Search
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              enterButton
              size="middle"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button (Mobile) */}
            <Button
              type="text"
              icon={<SearchOutlined />}
              onClick={() => dispatch(toggleSearchModal())}
              className="md:hidden"
            />

            {/* Cart */}
            <Button
              type="text"
              icon={
                <Badge count={itemCount} size="small">
                  <ShoppingCartOutlined className="text-xl" />
                </Badge>
              }
              onClick={() => dispatch(toggleCartDrawer())}
            />

            {/* User Menu */}
            {isAuthenticated ? (
              <Dropdown
                menu={{
                  items: user?.role === 'admin' ? adminMenuItems : userMenuItems,
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button type="text" icon={<UserOutlined />} />
              </Dropdown>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button type="text">Login</Button>
                </Link>
                <Link href="/register">
                  <Button type="primary">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              type="text"
              icon={<MenuOutlined />}
              className="md:hidden"
            />
          </div>
        </div>
      </div>
    </header>
  );
} 