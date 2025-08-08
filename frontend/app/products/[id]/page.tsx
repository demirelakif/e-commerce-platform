"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Spin, Empty, Tag, InputNumber, Divider, Rate, Avatar, Input, Breadcrumb } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  StarFilled,
  UserOutlined,
  HomeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";
import { message } from "antd";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";

const { TextArea } = Input;

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

interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  averageRating: number;
  reviewCount: number;
  discount?: number;
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
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user || null;

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchRelatedProducts();
      fetchReviews();
      if (isAuthenticated) {
        checkWishlistStatus();
      }
    }
  }, [productId, isAuthenticated]);

  const fetchRelatedProducts = async () => {
    setRelatedLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/related`);
      const data = await response.json();

      if (data.success && data.data) {
        setRelatedProducts(data.data);
      } else {
        setRelatedProducts([]);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
      setRelatedProducts([]);
    } finally {
      setRelatedLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/wishlist`);
      const data = await response.json();
      if (data.success && data.data) {
        const wishlistItems = data.data;
        setIsInWishlist(wishlistItems.some((item: any) => item._id === productId));
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      message.warning("Please login to manage your wishlist");
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/wishlist/${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success) {
          setIsInWishlist(false);
          message.success("Removed from wishlist");
        } else {
          message.error("Failed to remove from wishlist");
        }
      } else {
        // Add to wishlist
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/wishlist/${productId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success) {
          setIsInWishlist(true);
          message.success("Added to wishlist");
        } else {
          message.error("Failed to add to wishlist");
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      message.error("Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
      const data = await response.json();

      if (data.success && data.data) {
        setProduct(data.data);
      } else {
        setProduct(null);
        message.error(data.error || "Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
      message.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/product/${productId}`);
      const data = await response.json();

      if (data.success && data.data) {
        setReviews(data.data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
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

    if (!reviewForm.comment.trim()) {
      message.warning("Please enter a review comment");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}`,
        },
        body: JSON.stringify({
          product: productId,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        message.success("Review submitted successfully!");
        setReviewForm({ rating: 5, comment: "" });
        fetchReviews(); // Refresh reviews
        fetchProduct(); // Refresh product data to update rating
      } else {
        message.error(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Failed to submit review");
    }
  };

  const formatDate = (dateString: string) => {
    if (typeof window === "undefined") return "";
    return new Date(dateString).toLocaleDateString();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      message.success("Link copied to clipboard!");
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
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <Link href="/">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/products">Products</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href={`/categories/${product.category._id}`}>{product.category.name}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[32, 32]}>
          {/* Product Images */}
          <Col xs={24} lg={12}>
            <Card>
              <div className="relative h-96 mb-4 group">
                <Image
                  src={product.images[selectedImage] || "/placeholder-product.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                {discountPercentage > 0 && (
                  <Tag color="red" className="absolute top-2 left-2 z-10">
                    -{discountPercentage}%
                  </Tag>
                )}
                <div className="absolute top-2 right-2 z-10">
                  <Button type="text" icon={<ShareAltOutlined />} onClick={handleShare} className="bg-white/80 hover:bg-white" />
                </div>
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`relative w-16 h-16 cursor-pointer border-2 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                        selectedImage === index ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-blue-300"
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

                {/* Stock Status */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <InputNumber min={1} max={product.stock} value={quantity} onChange={(value) => setQuantity(value || 1)} />
                    <span className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                      {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className="flex-1"
                    >
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                    <Button
                      size="large"
                      icon={isInWishlist ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                      onClick={handleWishlistToggle}
                      loading={wishlistLoading}
                      className={isInWishlist ? "text-red-500 border-red-500" : ""}
                    >
                      {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
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
                {reviewsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spin size="large" />
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-start gap-3">
                        <Avatar icon={<UserOutlined />} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {review.user.firstName} {review.user.lastName}
                            </span>
                            <Rate disabled defaultValue={review.rating} />
                          </div>
                          <p className="text-gray-600 mb-2">{review.comment}</p>
                          <span className="text-sm text-gray-400">{formatDate(review.createdAt)}</span>
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

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <Row className="mt-8">
            <Col span={24}>
              <Card title="Related Products">
                {relatedLoading ? (
                  <div className="flex justify-center py-8">
                    <Spin size="large" />
                  </div>
                ) : (
                  <Row gutter={[16, 16]}>
                    {relatedProducts.map((relatedProduct) => (
                      <Col xs={24} sm={12} md={8} lg={6} key={relatedProduct._id}>
                        <Card
                          hoverable
                          className="h-full"
                          cover={
                            <div className="relative h-48 overflow-hidden">
                              <Image
                                src={relatedProduct.images?.[0] || "/placeholder-product.jpg"}
                                alt={relatedProduct.name}
                                fill
                                className="object-cover"
                              />
                              {relatedProduct.discount && (
                                <Tag color="red" className="absolute top-2 left-2">
                                  -{relatedProduct.discount}%
                                </Tag>
                              )}
                            </div>
                          }
                          actions={[
                            <Link key="view" href={`/products/${relatedProduct._id}`}>
                              <Button type="text" icon={<ShoppingCartOutlined />}>
                                View Details
                              </Button>
                            </Link>,
                          ]}
                        >
                          <Card.Meta
                            title={relatedProduct.name}
                            description={
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-lg font-bold text-blue-600">${relatedProduct.price}</span>
                                  <div className="flex items-center">
                                    <Rate disabled defaultValue={relatedProduct.averageRating} />
                                    <span className="text-sm text-gray-600 ml-1">({relatedProduct.reviewCount})</span>
                                  </div>
                                </div>
                                <Tag color="blue" className="mt-2">
                                  {relatedProduct.category.name}
                                </Tag>
                              </div>
                            }
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}
