"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Avatar, Tag, Spin, Alert } from "antd";
import { ShoppingOutlined, UserOutlined, FileTextOutlined, DollarOutlined, StarOutlined, EyeOutlined } from "@ant-design/icons";
import { adminAPI } from "@/lib/api";

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalReviews: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  pendingReviews: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface PopularProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  viewCount: number;
  averageRating: number;
  category: {
    name: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          adminAPI.getDashboardStats(),
          adminAPI.getRecentOrders(),
          adminAPI.getPopularProducts(),
        ]);

        setStats(statsRes.data.data);
        setRecentOrders(ordersRes.data.data);
        setPopularProducts(productsRes.data.data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "orange";
      case "processing":
        return "blue";
      case "shipped":
        return "purple";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const orderColumns = [
    {
      title: "Order #",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Customer",
      dataIndex: "user",
      key: "customer",
      render: (user: any) => `${user?.firstName || ""} ${user?.lastName || ""}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats?.totalOrders || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats?.totalProducts || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={stats?.totalCustomers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Monthly Revenue"
              value={stats?.revenueThisMonth || 0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#52c41a" }}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders and Popular Products */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Orders" className="h-full">
            <Table dataSource={recentOrders} columns={orderColumns} pagination={false} size="small" rowKey="_id" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Popular Products" className="h-full">
            <div className="space-y-4">
              {popularProducts.map((item) => (
                <div key={item._id} className="flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0">
                  <Avatar src={item.images?.[0]} shape="square" size={48}>
                    <ShoppingOutlined />
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-semibold">${item.price.toFixed(2)}</span>
                        <Tag color="blue">{item.category?.name || "N/A"}</Tag>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          <EyeOutlined className="mr-1" />
                          {item.viewCount || 0} views
                        </span>
                        <span>
                          <StarOutlined className="mr-1" />
                          {(item.averageRating || 0).toFixed(1)} rating
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {popularProducts.length === 0 && <div className="text-center py-8 text-gray-500">No popular products found</div>}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card title="This Month">
            <Statistic title="Orders This Month" value={stats?.ordersThisMonth || 0} prefix={<ShoppingOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="Reviews">
            <Statistic
              title="Pending Reviews"
              value={stats?.pendingReviews || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
