"use client";

import { useState, useEffect } from "react";
import { Card, Table, Button, Space, Tag, Modal, Form, Select, Input, message, Spin, Alert, Descriptions } from "antd";
import { EyeOutlined, EditOutlined, PrinterOutlined } from "@ant-design/icons";
import { ordersAPI } from "@/lib/api";

const { Option } = Select;
const { TextArea } = Input;

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      images: string[];
    };
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrders({ limit: 100 });
      setOrders(response.data.data);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, { status });
      message.success("Order status updated successfully");
      fetchOrders();
    } catch (err: any) {
      message.error(err.message || "Failed to update order status");
    }
  };

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

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "green";
      case "pending":
        return "orange";
      case "failed":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Order #",
      dataIndex: "orderNumber",
      key: "orderNumber",
    },
    {
      title: "Customer",
      dataIndex: "user",
      key: "customer",
      render: (user: any) => `${user.firstName} ${user.lastName}`,
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => `$${total.toFixed(2)}`,
      sorter: (a: Order, b: Order) => a.total - b.total,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>,
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status: string) => <Tag color={getPaymentStatusColor(status)}>{status.toUpperCase()}</Tag>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Order, b: Order) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Order) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewOrder(record)}>
            View
          </Button>
          <Select defaultValue={record.status} style={{ width: 120 }} onChange={(value) => handleUpdateStatus(record._id, value)}>
            <Option value="pending">Pending</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </Space>
      ),
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
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage customer orders</p>
      </div>

      <Card>
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>

      <Modal
        title="Order Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>
            Print
          </Button>,
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <div className="space-y-6">
            <Descriptions title="Order Information" bordered>
              <Descriptions.Item label="Order Number" span={3}>
                {selectedOrder.orderNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Customer" span={3}>
                {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                <br />
                {selectedOrder.user.email}
              </Descriptions.Item>
              <Descriptions.Item label="Order Date" span={3}>
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={3}>
                <Tag color={getStatusColor(selectedOrder.status)}>{selectedOrder.status.toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status" span={3}>
                <Tag color={getPaymentStatusColor(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus.toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total" span={3}>
                <span className="text-lg font-bold">${selectedOrder.total.toFixed(2)}</span>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Shipping Address" bordered>
              <Descriptions.Item label="Name" span={3}>
                {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Address" span={3}>
                {selectedOrder.shippingAddress.street}
                <br />
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                {selectedOrder.shippingAddress.zipCode}
                <br />
                {selectedOrder.shippingAddress.country}
              </Descriptions.Item>
              <Descriptions.Item label="Phone" span={3}>
                {selectedOrder.shippingAddress.phone}
              </Descriptions.Item>
            </Descriptions>

            <div>
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <Table
                dataSource={selectedOrder.items}
                columns={[
                  {
                    title: "Product",
                    dataIndex: "product",
                    key: "product",
                    render: (product: any) => product.name,
                  },
                  {
                    title: "Quantity",
                    dataIndex: "quantity",
                    key: "quantity",
                  },
                  {
                    title: "Price",
                    dataIndex: "price",
                    key: "price",
                    render: (price: number) => `$${price.toFixed(2)}`,
                  },
                  {
                    title: "Total",
                    key: "total",
                    render: (_, record: any) => `$${(record.price * record.quantity).toFixed(2)}`,
                  },
                ]}
                pagination={false}
                size="small"
              />
            </div>

            {selectedOrder.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <p className="text-gray-600">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
