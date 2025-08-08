"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Input, Select, Button, Pagination, Spin, Empty, Tag, message } from "antd";
import { SearchOutlined, FilterOutlined, ShoppingCartOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";
import { usersAPI } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const { Search } = Input;
const { Option } = Select;

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  stock: number;
  averageRating: number;
  reviewCount: number;
  discount?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState<{ [key: string]: boolean }>({});

  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth?.isAuthenticated || false;
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for search query in URL params
    const searchParam = searchParams.get("search");
    if (searchParam && searchParam !== searchQuery) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [currentPage, searchQuery, categoryFilter, sortBy, priceRange, isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const response = await usersAPI.getWishlist();
      if (response.data.success && response.data.data) {
        const wishlistIds = response.data.data.map((item: any) => item._id);
        setWishlistItems(wishlistIds);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      const data = await response.json();

      if (data.success && data.data) {
        setCategories(Array.isArray(data.data) ? data.data : []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        search: searchQuery,
        sortBy,
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
      });

      // Only add category parameter if it's not empty or undefined
      if (categoryFilter && categoryFilter.trim() !== "") {
        params.append("category", categoryFilter);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${params}`);
      const data = await response.json();
      console.log("response:", data);

      if (data.success && data.data) {
        setProducts(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
        setTotalItems(data.pagination?.total || 0);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      message.warning("Please login to add items to cart");
      return;
    }

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1,
        sku: product._id, // Using _id as SKU for now
      })
    );
    message.success("Added to cart!");
  };

  const handleWishlistToggle = async (product: Product) => {
    if (!isAuthenticated) {
      message.warning("Please login to manage your wishlist");
      return;
    }

    setWishlistLoading((prev) => ({ ...prev, [product._id]: true }));

    try {
      if (wishlistItems.includes(product._id)) {
        // Remove from wishlist
        const response = await usersAPI.removeFromWishlist(product._id);
        if (response.data.success) {
          setWishlistItems((prev) => prev.filter((id) => id !== product._id));
          message.success("Removed from wishlist");
        } else {
          message.error("Failed to remove from wishlist");
        }
      } else {
        // Add to wishlist
        const response = await usersAPI.addToWishlist(product._id);
        if (response.data.success) {
          setWishlistItems((prev) => [...prev, product._id]);
          message.success("Added to wishlist");
        } else {
          message.error("Failed to add to wishlist");
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      message.error("Failed to update wishlist");
    } finally {
      setWishlistLoading((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string | undefined) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter(undefined);
    setSortBy("name");
    setPriceRange([0, 10000]);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Discover our amazing collection of products</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <Search
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={handleSearch}
                enterButton
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select
                placeholder="All Categories"
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="w-full"
                allowClear
              >
                {Array.isArray(categories) &&
                  categories.map((category: any) => (
                    <Option key={category._id} value={category._id}>
                      {category.name}
                    </Option>
                  ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <Select value={sortBy} onChange={handleSortChange} className="w-full">
                <Option value="name">Name A-Z</Option>
                <Option value="-name">Name Z-A</Option>
                <Option value="price">Price Low to High</Option>
                <Option value="-price">Price High to Low</Option>
                <Option value="rating">Rating</Option>
                <Option value="createdAt">Newest</Option>
              </Select>
            </div>

            <div>
              <Button icon={<FilterOutlined />} onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          <Empty description="No products found" className="my-16" />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {products.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                  <Card
                    hoverable
                    className="h-full"
                    cover={
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={product.images[0] || "/placeholder-product.jpg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {product.discount && (
                          <Tag color="red" className="absolute top-2 left-2">
                            -{product.discount}%
                          </Tag>
                        )}
                      </div>
                    }
                    actions={[
                      <Button key="cart" type="text" icon={<ShoppingCartOutlined />} onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </Button>,
                      <Button
                        key="wishlist"
                        type="text"
                        icon={wishlistItems.includes(product._id) ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                        onClick={() => handleWishlistToggle(product)}
                        loading={wishlistLoading[product._id]}
                        className={wishlistItems.includes(product._id) ? "text-red-500" : ""}
                      >
                        {wishlistItems.includes(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      </Button>,
                    ]}
                  >
                    <Link href={`/products/${product._id}`}>
                      <Card.Meta
                        title={product.name}
                        description={
                          <div>
                            <p className="text-gray-600 text-sm mb-2">{product.description.substring(0, 100)}...</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-blue-600">${product.price}</span>
                              <div className="flex items-center">
                                <span className="text-yellow-500">★</span>
                                <span className="text-sm text-gray-600 ml-1">
                                  {product.averageRating} ({product.reviewCount})
                                </span>
                              </div>
                            </div>
                            <Tag color="blue" className="mt-2">
                              {product.category.name}
                            </Tag>
                          </div>
                        }
                      />
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <Pagination
                current={currentPage}
                total={totalItems}
                pageSize={12}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
