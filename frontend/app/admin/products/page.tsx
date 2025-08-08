"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Image,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  message,
  Popconfirm,
  Spin,
  Alert,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, EyeOutlined } from "@ant-design/icons";
import { productsAPI } from "@/lib/api";
import { RcFile } from "antd/es/upload";

const { TextArea } = Input;
const { Option } = Select;

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    _id: string;
    name: string;
  };
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProducts({ limit: 100 });
      setProducts(response.data.data);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productsAPI.getCategories();
      setCategories(response.data.data);
    } catch (err: any) {
      console.error("Failed to load categories:", err);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category._id,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    });
    setModalVisible(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await productsAPI.deleteProduct(productId);
      message.success("Product deleted successfully");
      fetchProducts();
    } catch (err: any) {
      message.error(err.message || "Failed to delete product");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingProduct) {
        await productsAPI.updateProduct(editingProduct._id, values);
        message.success("Product updated successfully");
      } else {
        await productsAPI.createProduct(values);
        message.success("Product created successfully");
      }
      setModalVisible(false);
      fetchProducts();
    } catch (err: any) {
      message.error(err.message || "Failed to save product");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      key: "images",
      render: (images: string[]) => (
        <Image width={50} height={50} src={images[0] || "/placeholder.png"} alt="Product" fallback="/placeholder.png" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: any) => category?.name || "N/A",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
      sorter: (a: Product, b: Product) => a.price - b.price,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => <Tag color={stock > 10 ? "green" : stock > 0 ? "orange" : "red"}>{stock}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>,
    },
    {
      title: "Featured",
      dataIndex: "isFeatured",
      key: "isFeatured",
      render: (isFeatured: boolean) => <Tag color={isFeatured ? "blue" : "default"}>{isFeatured ? "Featured" : "Regular"}</Tag>,
    },
    {
      title: "Rating",
      dataIndex: "averageRating",
      key: "averageRating",
      render: (rating: number) => rating.toFixed(1),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => window.open(`/products/${record._id}`, "_blank")} />
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEditProduct(record)} />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteProduct(record._id)}
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
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
          Add Product
        </Button>
      </div>

      <Card>
        <Table
          dataSource={products}
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
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true,
            isFeatured: false,
          }}
        >
          <Form.Item name="name" label="Product Name" rules={[{ required: true, message: "Please enter product name" }]}>
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter product description" }]}
          >
            <TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
            <Select placeholder="Select category">
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please enter price" }]}>
            <InputNumber min={0} step={0.01} placeholder="Enter price" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="stock" label="Stock" rules={[{ required: true, message: "Please enter stock quantity" }]}>
            <InputNumber min={0} placeholder="Enter stock quantity" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="isActive" valuePropName="checked">
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item name="isFeatured" valuePropName="checked">
            <Select>
              <Option value={true}>Featured</Option>
              <Option value={false}>Regular</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
