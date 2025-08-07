"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Carousel, Tag, Spin } from "antd";
import {
  ShoppingOutlined,
  StarOutlined,
  FireOutlined,
  GiftOutlined,
  TruckOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: {
    name: string;
  };
  averageRating: number;
  reviewCount: number;
  discount?: number;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/featured`);
      const data = await response.json();
      if (data.success) {
        setFeaturedProducts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  const heroSlides = [
    {
      title: "New Collection Arrived",
      subtitle: "Discover the latest trends in fashion and lifestyle",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      buttonText: "Shop Now",
      buttonLink: "/products",
    },
    {
      title: "Special Offers",
      subtitle: "Up to 50% off on selected items",
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=600&fit=crop",
      buttonText: "View Offers",
      buttonLink: "/products?discount=true",
    },
    {
      title: "Free Shipping",
      subtitle: "On orders over $50",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
      buttonText: "Learn More",
      buttonLink: "/about",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative">
        <Carousel autoplay dots={{ className: "bottom-4" }} effect="fade">
          {heroSlides.map((slide, index) => (
            <div key={index} className="relative h-96 md:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center">
                <div className="container-custom text-white z-20">
                  <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">{slide.title}</h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90">{slide.subtitle}</p>
                    <Link href={slide.buttonLink}>
                      <Button type="primary" size="large" className="h-12 px-8 text-lg">
                        {slide.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gray-900">
                <div className="w-full h-full bg-gradient-to-r from-blue-600/80 to-purple-600/80" />
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide the best shopping experience with quality products and excellent service
            </p>
          </div>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <TruckOutlined className="text-4xl text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
                <p className="text-gray-600">Free shipping on orders over $50</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <SafetyOutlined className="text-4xl text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                <p className="text-gray-600">100% secure payment processing</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <ClockCircleOutlined className="text-4xl text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">Round the clock customer support</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <GiftOutlined className="text-4xl text-red-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
                <p className="text-gray-600">30-day return policy</p>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Discover our most popular and trending products</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {featuredProducts.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                  <Card
                    hoverable
                    className="h-full"
                    cover={
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={product.images?.[0] || "https://via.placeholder.com/300x200"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {product.discount && (
                          <Tag color="red" className="absolute top-2 left-2">
                            -{product.discount}%
                          </Tag>
                        )}
                      </div>
                    }
                    actions={[
                      <Link key="view" href={`/products/${product._id}`}>
                        <Button type="text" icon={<ShoppingOutlined />}>
                          View Details
                        </Button>
                      </Link>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Link href={`/products/${product._id}`} className="text-gray-900 hover:text-blue-600">
                          {product.name}
                        </Link>
                      }
                      description={
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-bold text-blue-600">${product.price}</span>
                            <div className="flex items-center">
                              <StarOutlined className="text-yellow-500 mr-1" />
                              <span className="text-sm text-gray-600">
                                {product.averageRating} ({product.reviewCount})
                              </span>
                            </div>
                          </div>
                          <Tag color="blue">{product.category.name}</Tag>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <div className="text-center mt-8">
            <Link href="/products">
              <Button type="primary" size="large" className="h-12 px-8">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Explore our wide range of product categories</p>
          </div>
          <Row gutter={[16, 16]}>
            {[
              { name: "Electronics", icon: "📱", color: "bg-blue-500" },
              { name: "Fashion", icon: "👕", color: "bg-pink-500" },
              { name: "Home & Garden", icon: "🏠", color: "bg-green-500" },
              { name: "Sports", icon: "⚽", color: "bg-orange-500" },
              { name: "Books", icon: "📚", color: "bg-purple-500" },
              { name: "Beauty", icon: "💄", color: "bg-red-500" },
            ].map((category, index) => (
              <Col xs={12} sm={8} md={6} lg={4} key={index}>
                <Link href="/categories">
                  <Card hoverable className="text-center h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-90">Subscribe to our newsletter for the latest products and exclusive offers</p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button type="primary" size="large" className="rounded-l-none h-12 px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Start Shopping?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our extensive collection of products and find exactly what you're looking for. Join thousands of satisfied
            customers who trust us for their shopping needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button type="primary" size="large" className="h-12 px-8">
                Explore Products
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="large" className="h-12 px-8">
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
