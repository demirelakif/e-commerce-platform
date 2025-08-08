"use client";

import { useState, useEffect } from "react";
import { Card, Table, Button, Space, Tag, Modal, Descriptions, Avatar, message, Spin, Alert, Input } from "antd";
import { EyeOutlined, UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { api } from "@/lib/api";

const { Search } = Input;

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  isEmailVerified: boolean;
  addresses: Array<{
    _id: string;
    type: "shipping" | "billing";
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
  preferences: {
    favoriteCategories: string[];
    newsletterSubscription: boolean;
  };
  createdAt: string;
  lastLogin?: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users?role=customer&limit=100");
      setCustomers(response.data.data);
    } catch (err: any) {
      setError(err.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalVisible(true);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (customer: Customer) => (
        <div className="flex items-center space-x-3">
          <Avatar size="large" className="bg-blue-600">
            {customer.firstName.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div className="font-medium">
              {customer.firstName} {customer.lastName}
            </div>
            <div className="text-sm text-gray-500">{customer.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => phone || "N/A",
    },
    {
      title: "Status",
      key: "status",
      render: (customer: Customer) => (
        <Space>
          <Tag color={customer.isEmailVerified ? "green" : "orange"}>{customer.isEmailVerified ? "Verified" : "Unverified"}</Tag>
          <Tag color="blue">{customer.role}</Tag>
        </Space>
      ),
    },
    {
      title: "Addresses",
      key: "addresses",
      render: (customer: Customer) => (
        <span>
          {customer.addresses.length} address{customer.addresses.length !== 1 ? "es" : ""}
        </span>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Customer, b: Customer) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : "Never"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Customer) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewCustomer(record)}>
          View Details
        </Button>
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
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">Manage customer accounts and information</p>
      </div>

      <Card>
        <div className="mb-4">
          <Search
            placeholder="Search customers by name or email"
            allowClear
            enterButton
            size="large"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Table
          dataSource={filteredCustomers}
          columns={columns}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} customers`,
          }}
        />
      </Card>

      <Modal
        title="Customer Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <Descriptions title="Customer Information" bordered>
              <Descriptions.Item label="Name" span={3}>
                {selectedCustomer.firstName} {selectedCustomer.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Email" span={3}>
                {selectedCustomer.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone" span={3}>
                {selectedCustomer.phone || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={3}>
                <Space>
                  <Tag color={selectedCustomer.isEmailVerified ? "green" : "orange"}>
                    {selectedCustomer.isEmailVerified ? "Email Verified" : "Email Unverified"}
                  </Tag>
                  <Tag color="blue">{selectedCustomer.role}</Tag>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Joined" span={3}>
                {new Date(selectedCustomer.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Login" span={3}>
                {selectedCustomer.lastLogin ? new Date(selectedCustomer.lastLogin).toLocaleString() : "Never"}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Preferences" bordered>
              <Descriptions.Item label="Newsletter Subscription" span={3}>
                <Tag color={selectedCustomer.preferences.newsletterSubscription ? "green" : "red"}>
                  {selectedCustomer.preferences.newsletterSubscription ? "Subscribed" : "Not Subscribed"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Favorite Categories" span={3}>
                {selectedCustomer.preferences.favoriteCategories.length > 0 ? (
                  <Space>
                    {selectedCustomer.preferences.favoriteCategories.map((category) => (
                      <Tag key={category} color="blue">
                        {category}
                      </Tag>
                    ))}
                  </Space>
                ) : (
                  "None"
                )}
              </Descriptions.Item>
            </Descriptions>

            {selectedCustomer.addresses.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Addresses</h3>
                {selectedCustomer.addresses.map((address) => (
                  <Card key={address._id} size="small" className="mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">
                          {address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address
                          {address.isDefault && (
                            <Tag color="green" className="ml-2">
                              Default
                            </Tag>
                          )}
                        </div>
                        <div className="text-gray-600">
                          {address.street}
                          <br />
                          {address.city}, {address.state} {address.zipCode}
                          <br />
                          {address.country}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
