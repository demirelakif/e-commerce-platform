"use client";

import { useState, useEffect } from "react";
import { Card, Table, Button, Space, Tag, Modal, Form, Input, message, Popconfirm, Spin, Alert, Image } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { categoriesAPI } from "@/lib/api";

const { TextArea } = Input;

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getCategories();
      setCategories(response.data.data);
    } catch (err: any) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
    });
    setModalVisible(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await categoriesAPI.deleteCategory(categoryId);
      message.success("Category deleted successfully");
      fetchCategories();
    } catch (err: any) {
      message.error(err.message || "Failed to delete category");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCategory) {
        await categoriesAPI.updateCategory(editingCategory._id, values);
        message.success("Category updated successfully");
      } else {
        await categoriesAPI.createCategory(values);
        message.success("Category created successfully");
      }
      setModalVisible(false);
      fetchCategories();
    } catch (err: any) {
      message.error(err.message || "Failed to save category");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <Image width={50} height={50} src={image || "/placeholder.png"} alt="Category" fallback="/placeholder.png" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Category, b: Category) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => description || "No description",
    },
    {
      title: "Products",
      dataIndex: "productCount",
      key: "productCount",
      render: (count: number) => count || 0,
      sorter: (a: Category, b: Category) => (a.productCount || 0) - (b.productCount || 0),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Category, b: Category) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Category) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => window.open(`/categories/${record._id}`, "_blank")} />
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEditCategory(record)} />
          <Popconfirm
            title="Are you sure you want to delete this category?"
            description="This action cannot be undone."
            onConfirm={() => handleDeleteCategory(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>
          Add Category
        </Button>
      </div>

      <Card>
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} categories`,
          }}
        />
      </Card>

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true,
          }}
        >
          <Form.Item name="name" label="Category Name" rules={[{ required: true, message: "Please enter category name" }]}>
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Enter category description" />
          </Form.Item>

          <Form.Item name="isActive" label="Status">
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
