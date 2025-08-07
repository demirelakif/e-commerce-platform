"use client";

import { Card, Row, Col, Typography } from "antd";
import { ShoppingOutlined, HeartOutlined, SafetyOutlined, TeamOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-900 mb-4">
            About Our E-Commerce Platform
          </Title>
          <Paragraph className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are dedicated to providing the best shopping experience with quality products, excellent customer service, and
            secure transactions.
          </Paragraph>
        </div>

        {/* Features Grid */}
        <Row gutter={[24, 24]} className="mb-12">
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center h-full">
              <ShoppingOutlined className="text-4xl text-blue-600 mb-4" />
              <Title level={4}>Wide Selection</Title>
              <Paragraph>Thousands of products across multiple categories to meet all your needs.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center h-full">
              <SafetyOutlined className="text-4xl text-green-600 mb-4" />
              <Title level={4}>Secure Shopping</Title>
              <Paragraph>Your security is our priority with encrypted transactions and data protection.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center h-full">
              <HeartOutlined className="text-4xl text-red-600 mb-4" />
              <Title level={4}>Customer First</Title>
              <Paragraph>Exceptional customer service and support available 24/7.</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="text-center h-full">
              <TeamOutlined className="text-4xl text-purple-600 mb-4" />
              <Title level={4}>Expert Team</Title>
              <Paragraph>Our team of experts ensures quality products and smooth operations.</Paragraph>
            </Card>
          </Col>
        </Row>

        {/* Story Section */}
        <Card className="mb-12">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} lg={12}>
              <Title level={2} className="mb-4">
                Our Story
              </Title>
              <Paragraph className="text-lg">
                Founded with a vision to revolutionize online shopping, our platform has grown from a small startup to a trusted
                destination for millions of customers worldwide.
              </Paragraph>
              <Paragraph className="text-lg">
                We believe in providing not just products, but complete solutions that enhance your lifestyle and make shopping
                convenient, secure, and enjoyable.
              </Paragraph>
            </Col>
            <Col xs={24} lg={12}>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-64 rounded-lg flex items-center justify-center">
                <span className="text-white text-6xl">🏪</span>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Stats Section */}
        <Card className="text-center">
          <Title level={2} className="mb-8">
            Our Numbers
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={12} sm={6}>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-600">Products</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                <div className="text-gray-600">Customers</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
                <div className="text-gray-600">Categories</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}
