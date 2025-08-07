"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getCurrentUser } from "@/store/slices/authSlice";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "../cart/CartDrawer";
import SearchModal from "../ui/SearchModal";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Check if user is authenticated on app load
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        // Only fetch user data if we don't already have it
        dispatch(getCurrentUser());
      }
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <SearchModal />
    </div>
  );
}
