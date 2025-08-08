'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Empty, Tag } from 'antd';
import { ShoppingOutlined, FireOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  slug: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      const data = await response.json();
      
      // Handle the API response structure correctly
      if (data.success && data.data) {
        setCategories(Array.isArray(data.data) ? data.data : []);
      } else if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('electronics')) return '📱';
    if (name.includes('clothing')) return '👕';
    if (name.includes('books')) return '📚';
    if (name.includes('home')) return '🏠';
    if (name.includes('sports')) return '⚽';
    if (name.includes('beauty')) return '💄';
    if (name.includes('toys')) return '🧸';
    if (name.includes('food')) return '🍎';
    return '🛍️';
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of products organized by categories. 
            Find exactly what you're looking for with our carefully curated collections.
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : categories.length === 0 ? (
          <Empty
            description="No categories found"
            className="my-16"
          />
        ) : (
          <Row gutter={[24, 24]}>
            {categories.map((category, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={category._id}>
                <Link href={`/products?category=${category._id}`}>
                  <Card
                    hoverable
                    className="h-full text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    cover={
                      <div className="relative h-48 overflow-hidden">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className={`h-full flex items-center justify-center ${getCategoryColor(index)}`}>
                            <span className="text-6xl">{getCategoryIcon(category.name)}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <div className="text-white text-center">
                            <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                            <Tag color="white" className="text-black">
                              {category.productCount} Products
                            </Tag>
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <Card.Meta
                      title={
                        <div className="text-center">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            {category.description}
                          </p>
                          <div className="flex items-center justify-center space-x-2">
                            <ShoppingOutlined className="text-blue-500" />
                            <span className="text-sm text-gray-500">
                              {category.productCount} items available
                            </span>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}

        {/* Featured Categories Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Categories
            </h2>
            <p className="text-gray-600">
              Our most popular categories with trending products
            </p>
          </div>

          <Row gutter={[16, 16]}>
            {categories.slice(0, 4).map((category, index) => (
              <Col xs={24} sm={12} lg={6} key={`featured-${category._id}`}>
                <Link href={`/products?category=${category._id}`}>
                  <Card
                    hoverable
                    className="text-center border-2 border-transparent hover:border-blue-500 transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${getCategoryColor(index)} flex items-center justify-center`}>
                        <span className="text-2xl">{getCategoryIcon(category.name)}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {category.description.substring(0, 80)}...
                      </p>
                      <div className="flex items-center justify-center space-x-1">
                        <FireOutlined className="text-red-500" />
                        <span className="text-sm text-gray-500">
                          {category.productCount} products
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="py-8">
              <h2 className="text-3xl font-bold mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Browse all our products or contact our support team for assistance
              </p>
              <div className="space-x-4">
                <Link href="/products">
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Browse All Products
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                    Contact Support
                  </button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 