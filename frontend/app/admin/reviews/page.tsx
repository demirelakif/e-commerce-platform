"use client";

import { useState, useEffect } from "react";
import { Card, Table, Button, Space, Tag, Modal, Rate, message, Popconfirm, Spin, Alert, Input } from "antd";
import { EyeOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { reviewsAPI } from "@/lib/api";

const { Search } = Input;

interface Review {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
  };
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getReviews({ limit: 100 });
      setReviews(response.data.data);
    } catch (err: any) {
      setError(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setModalVisible(true);
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      await reviewsAPI.approveReview(reviewId);
      message.success("Review approved successfully");
      fetchReviews();
    } catch (err: any) {
      message.error(err.message || "Failed to approve review");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewsAPI.deleteReview(reviewId);
      message.success("Review deleted successfully");
      fetchReviews();
    } catch (err: any) {
      message.error(err.message || "Failed to delete review");
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product: any) => (
        <div className="flex items-center space-x-2">
          <img src={product.images[0] || "/placeholder.png"} alt={product.name} className="w-8 h-8 object-cover rounded" />
          <span className="font-medium">{product.name}</span>
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "user",
      key: "user",
      render: (user: any) => `${user.firstName} ${user.lastName}`,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
      sorter: (a: Review, b: Review) => a.rating - b.rating,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string) => title || "No title",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (comment: string) => (
        <div className="max-w-xs truncate" title={comment}>
          {comment}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isApproved",
      key: "isApproved",
      render: (isApproved: boolean) => <Tag color={isApproved ? "green" : "orange"}>{isApproved ? "Approved" : "Pending"}</Tag>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Review, b: Review) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Review) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewReview(record)}>
            View
          </Button>
          {!record.isApproved && (
            <Button
              type="text"
              icon={<CheckOutlined />}
              onClick={() => handleApproveReview(record._id)}
              className="text-green-600"
            >
              Approve
            </Button>
          )}
          <Popconfirm
            title="Are you sure you want to delete this review?"
            onConfirm={() => handleDeleteReview(record._id)}
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600">Manage product reviews and ratings</p>
      </div>

      <Card>
        <div className="mb-4">
          <Search
            placeholder="Search reviews by product, customer, or comment"
            allowClear
            enterButton
            size="large"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Table
          dataSource={filteredReviews}
          columns={columns}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} reviews`,
          }}
        />
      </Card>

      <Modal
        title="Review Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedReview && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={selectedReview.product.images[0] || "/placeholder.png"}
                alt={selectedReview.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{selectedReview.product.name}</h3>
                <p className="text-gray-600">
                  Reviewed by {selectedReview.user.firstName} {selectedReview.user.lastName}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Rate disabled defaultValue={selectedReview.rating} />
                <span className="text-gray-600">({selectedReview.rating}/5)</span>
              </div>
              {selectedReview.title && <h4 className="font-medium mb-2">{selectedReview.title}</h4>}
              <p className="text-gray-700">{selectedReview.comment}</p>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <Tag color={selectedReview.isApproved ? "green" : "orange"}>
                  {selectedReview.isApproved ? "Approved" : "Pending Approval"}
                </Tag>
              </div>
              <div className="text-sm text-gray-500">{new Date(selectedReview.createdAt).toLocaleString()}</div>
            </div>

            {!selectedReview.isApproved && (
              <div className="pt-4 border-t">
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => {
                    handleApproveReview(selectedReview._id);
                    setModalVisible(false);
                  }}
                >
                  Approve Review
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
