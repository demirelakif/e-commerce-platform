"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spin, Empty, Tag, InputNumber, Divider, Rate, Avatar } from "antd";
import { ShoppingCartOutlined, HeartOutlined, StarFilled, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";
import { message } from "antd";
import Image from "next/image";
import { useParams } from "next/navigation";

const { TextArea } = require("antd");

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  stock: number;
  averageRating: number;
  reviewCount: number;
  discount?: number;
  specifications?: Array<{
    name: string;
    value: string;
  }>;
  reviews?: Array<{
    _id: string;
    user: {
      firstName: string;
      lastName: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user || null;

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
      const data = await response.json();

      if (data.success && data.data) {
        setProduct(data.data);
      } else {
        message.error("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      message.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      message.warning("Please login to add items to cart");
      return;
    }

    if (!product) return;

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
        sku: product._id,
      })
    );
    message.success("Added to cart!");
  };

  const handleReviewSubmit = async () => {
    if (!isAuthenticated) {
      message.warning("Please login to submit a review");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        message.success("Review submitted successfully!");
        setReviewForm({ rating: 5, comment: "" });
        fetchProduct(); // Refresh product data
      } else {
        message.error(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Failed to submit review");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Empty description="Product not found" />
      </div>
    );
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <Row gutter={[32, 32]}>
          {/* Product Images */}
          <Col xs={24} lg={12}>
            <Card>
              <div className="relative h-96 mb-4">
                <Image
                  src={product.images[selectedImage] || "/placeholder-product.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
                {discountPercentage > 0 && (
                  <Tag color="red" className="absolute top-2 left-2">
                    -{discountPercentage}%
                  </Tag>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative w-16 h-16 cursor-pointer border-2 rounded-lg overflow-hidden ${
                        selectedImage === index ? "border-blue-500" : "border-gray-200"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Col>

          {/* Product Info */}
          <Col xs={24} lg={12}>
            <Card>
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <Rate disabled defaultValue={product.averageRating} />
                  <span className="text-gray-600">({product.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  {product.originalPrice && product.originalPrice > product.price ? (
                    <>
                      <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                      <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                  )}
                </div>

                <p className="text-gray-600 mb-6">{product.description}</p>

                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <InputNumber min={1} max={product.stock} value={quantity} onChange={(value) => setQuantity(value || 1)} />
                    <span className="text-sm text-gray-500">{product.stock} available</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                    >
                      Add to Cart
                    </Button>
                    <Button size="large" icon={<HeartOutlined />}>
                      Wishlist
                    </Button>
                  </div>
                </div>

                {/* Specifications */}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {product.specifications.map((spec, index) => (
                        <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">{spec.name}</span>
                          <span className="text-gray-600">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Reviews Section */}
        <Row className="mt-8">
          <Col span={24}>
            <Card title="Customer Reviews">
              {/* Review Form */}
              {isAuthenticated && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3">Write a Review</h4>
                  <div className="mb-3">
                    <Rate value={reviewForm.rating} onChange={(value) => setReviewForm((prev) => ({ ...prev, rating: value }))} />
                  </div>
                  <TextArea
                    rows={4}
                    placeholder="Share your thoughts about this product..."
                    value={reviewForm.comment}
                    onChange={(e: any) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                    className="mb-3"
                  />
                  <Button type="primary" onClick={handleReviewSubmit}>
                    Submit Review
                  </Button>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-start gap-3">
                        <Avatar icon={<UserOutlined />} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {review.user.firstName} {review.user.lastName}
                            </span>
                            <Rate disabled defaultValue={review.rating} size="small" />
                          </div>
                          <p className="text-gray-600 mb-2">{review.comment}</p>
                          <span className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <Empty description="No reviews yet" />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
