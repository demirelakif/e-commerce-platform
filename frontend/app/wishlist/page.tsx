"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spin, Empty, message, Image } from "antd";
import { ShoppingCartOutlined, HeartOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";
import { usersAPI } from "@/lib/api";
import Link from "next/link";

interface WishlistItem {
  _id: string;
  name: string;
  mainImage?: string;
  images?: string[];
  price: number;
  averageRating: number;
  reviewCount: number;
  stock: number;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const response = await usersAPI.getWishlist();
      if (response.data.success) {
        setWishlist(response.data.data || []);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      message.error("Failed to load wishlist");
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    setRemovingItem(productId);
    try {
      const response = await usersAPI.removeFromWishlist(productId);
      if (response.data.success) {
        setWishlist(response.data.data || []);
        message.success("Item removed from wishlist");
      } else {
        message.error("Failed to remove item from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      message.error("Failed to remove item from wishlist");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleAddToCart = (product: WishlistItem) => {
    if (!isAuthenticated) {
      message.warning("Please login to add items to cart");
      return;
    }

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.mainImage || product.images?.[0] || "",
        quantity: 1,
      })
    );
    message.success("Added to cart");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
          <p className="text-gray-600 mb-6">Please login to view your wishlist</p>
          <Link href="/login">
            <Button type="primary" size="large">
              Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} in your wishlist
          </p>
        </div>

        {/* Wishlist Items */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : wishlist.length === 0 ? (
          <Empty description="Your wishlist is empty" className="my-16">
            <Link href="/products">
              <Button type="primary" size="large">
                Start Shopping
              </Button>
            </Link>
          </Empty>
        ) : (
          <Row gutter={[16, 16]}>
            {wishlist.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                <Card
                  hoverable
                  className="h-full"
                  cover={
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.mainImage || item.images?.[0] || "/placeholder-product.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  }
                  actions={[
                    <Button
                      key="cart"
                      type="text"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock === 0}
                    >
                      Add to Cart
                    </Button>,
                    <Button
                      key="remove"
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      loading={removingItem === item._id}
                      danger
                    >
                      Remove
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <Link href={`/products/${item._id}`} className="text-gray-900 hover:text-blue-600">
                        {item.name}
                      </Link>
                    }
                    description={
                      <div>
                        <div className="text-lg font-bold text-blue-600 mb-2">${item.price.toFixed(2)}</div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Stock: {item.stock}</span>
                          <span>Rating: {item.averageRating.toFixed(1)} ⭐</span>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
