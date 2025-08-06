'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '@/store/slices/authSlice';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import SearchModal from '../ui/SearchModal';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is authenticated on app load
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <SearchModal />
    </div>
  );
} 