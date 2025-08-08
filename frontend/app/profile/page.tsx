"use client";

import { useState, useEffect } from "react";
import { Card, Form, Input, Button, Spin, message, Tabs, Row, Col, Divider, Tag, Modal } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { usersAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

const { TabPane } = Tabs;

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
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
}

interface AddressFormData {
  type: "shipping" | "billing";
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressFormData | null>(null);
  const [addressForm] = Form.useForm();

  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user || null;
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, [isAuthenticated, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
      } else {
        message.error("Failed to load profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      message.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (values: any) => {
    setSaving(true);
    try {
      const response = await usersAPI.updateProfile(values);
      if (response.data.success) {
        message.success("Profile updated successfully");
        fetchProfile();
      } else {
        message.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (values: AddressFormData) => {
    try {
      if (editingAddress) {
        // Update existing address
        const response = await usersAPI.updateAddress(editingAddress._id || "", values);
        if (response.data.success) {
          message.success("Address updated successfully");
          setAddressModalVisible(false);
          setEditingAddress(null);
          addressForm.resetFields();
          fetchProfile();
        } else {
          message.error("Failed to update address");
        }
      } else {
        // Add new address
        const response = await usersAPI.addAddress(values);
        if (response.data.success) {
          message.success("Address added successfully");
          setAddressModalVisible(false);
          addressForm.resetFields();
          fetchProfile();
        } else {
          message.error("Failed to add address");
        }
      }
    } catch (error) {
      console.error("Error saving address:", error);
      message.error("Failed to save address");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await usersAPI.deleteAddress(addressId);
      if (response.data.success) {
        message.success("Address deleted successfully");
        fetchProfile();
      } else {
        message.error("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      message.error("Failed to delete address");
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const response = await usersAPI.setDefaultAddress(addressId);
      if (response.data.success) {
        message.success("Default address updated");
        fetchProfile();
      } else {
        message.error("Failed to update default address");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      message.error("Failed to update default address");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <Tabs defaultActiveKey="profile" className="bg-white rounded-lg shadow">
          <TabPane tab="Profile Information" key="profile">
            <div className="p-6">
              <Form
                layout="vertical"
                initialValues={{
                  firstName: profile?.firstName || "",
                  lastName: profile?.lastName || "",
                  phone: profile?.phone || "",
                }}
                onFinish={handleProfileUpdate}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="First Name"
                      name="firstName"
                      rules={[{ required: true, message: "Please enter your first name" }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="First Name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Last Name"
                      name="lastName"
                      rules={[{ required: true, message: "Please enter your last name" }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Last Name" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Email" name="email">
                  <Input prefix={<MailOutlined />} value={profile?.email} disabled />
                </Form.Item>

                <Form.Item label="Phone" name="phone">
                  <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={saving}>
                    Update Profile
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </TabPane>

          <TabPane tab="Addresses" key="addresses">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">My Addresses</h3>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingAddress(null);
                    addressForm.resetFields();
                    setAddressModalVisible(true);
                  }}
                >
                  Add Address
                </Button>
              </div>

              <Row gutter={[16, 16]}>
                {profile?.addresses?.map((address) => (
                  <Col xs={24} sm={12} key={address._id}>
                    <Card
                      className="h-full"
                      actions={[
                        <Button
                          key="edit"
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setEditingAddress(address);
                            addressForm.setFieldsValue(address);
                            setAddressModalVisible(true);
                          }}
                        >
                          Edit
                        </Button>,
                        <Button
                          key="delete"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteAddress(address._id)}
                        >
                          Delete
                        </Button>,
                      ]}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Tag color={address.type === "shipping" ? "blue" : "green"}>{address.type.toUpperCase()}</Tag>
                            {address.isDefault && <Tag color="red">Default</Tag>}
                          </div>
                          <p className="font-medium">{address.street}</p>
                          <p className="text-gray-600">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-gray-600">{address.country}</p>
                        </div>
                        {!address.isDefault && (
                          <Button size="small" onClick={() => handleSetDefaultAddress(address._id)}>
                            Set Default
                          </Button>
                        )}
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {(!profile?.addresses || profile.addresses.length === 0) && (
                <div className="text-center py-8">
                  <HomeOutlined className="text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-600">No addresses found</p>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditingAddress(null);
                      addressForm.resetFields();
                      setAddressModalVisible(true);
                    }}
                    className="mt-4"
                  >
                    Add Your First Address
                  </Button>
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>

        {/* Address Modal */}
        <Modal
          title={editingAddress ? "Edit Address" : "Add New Address"}
          open={addressModalVisible}
          onCancel={() => {
            setAddressModalVisible(false);
            setEditingAddress(null);
            addressForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={addressForm}
            layout="vertical"
            onFinish={handleAddressSubmit}
            initialValues={{
              type: "shipping",
              country: "United States",
              isDefault: false,
            }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Address Type" name="type" rules={[{ required: true, message: "Please select address type" }]}>
                  <Input.Group compact>
                    <Button
                      type="button"
                      onClick={() => addressForm.setFieldsValue({ type: "shipping" })}
                      className={addressForm.getFieldValue("type") === "shipping" ? "bg-blue-500 text-white" : ""}
                    >
                      Shipping
                    </Button>
                    <Button
                      type="button"
                      onClick={() => addressForm.setFieldsValue({ type: "billing" })}
                      className={addressForm.getFieldValue("type") === "billing" ? "bg-blue-500 text-white" : ""}
                    >
                      Billing
                    </Button>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Default Address" name="isDefault" valuePropName="checked">
                  <Input type="checkbox" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Street Address" name="street" rules={[{ required: true, message: "Please enter street address" }]}>
              <Input placeholder="Street Address" />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item label="City" name="city" rules={[{ required: true, message: "Please enter city" }]}>
                  <Input placeholder="City" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="State" name="state" rules={[{ required: true, message: "Please enter state" }]}>
                  <Input placeholder="State" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label="Zip Code" name="zipCode" rules={[{ required: true, message: "Please enter zip code" }]}>
                  <Input placeholder="Zip Code" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Country" name="country" rules={[{ required: true, message: "Please enter country" }]}>
              <Input placeholder="Country" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="mr-2">
                {editingAddress ? "Update Address" : "Add Address"}
              </Button>
              <Button
                onClick={() => {
                  setAddressModalVisible(false);
                  setEditingAddress(null);
                  addressForm.resetFields();
                }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
