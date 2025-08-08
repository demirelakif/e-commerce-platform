"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setSearchModalOpen } from "@/store/slices/uiSlice";
import { SearchOutlined, CloseOutlined, FireOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Modal, Input, Button, List, Avatar, Spin, Tag } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const { Search } = Input;

interface SearchResult {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: {
    name: string;
  };
  averageRating: number;
  reviewCount: number;
}

export default function SearchModal() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const ui = useSelector((state: RootState) => state.ui);
  const searchModalOpen = ui?.searchModalOpen || false;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleClose = () => {
    dispatch(setSearchModalOpen(false));
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      // Use the search endpoint instead of the products endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/search?q=${encodeURIComponent(value)}&limit=8`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data || []);
        // Save to recent searches
        const searches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
        const newSearches = [value, ...searches.filter((s: string) => s !== value)].slice(0, 5);
        localStorage.setItem("recentSearches", JSON.stringify(newSearches));
        setRecentSearches(newSearches);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    handleClose();
    router.push(`/products/${result._id}`);
  };

  const handleSearchSubmit = (value: string) => {
    if (value.trim()) {
      handleClose();
      router.push(`/products?search=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    handleSearch(search);
  };

  useEffect(() => {
    if (searchModalOpen) {
      const searches = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      setRecentSearches(searches);
    }
  }, [searchModalOpen]);

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        handleSearch(searchQuery);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <Modal
      open={searchModalOpen}
      onCancel={handleClose}
      footer={null}
      width="90%"
      style={{ top: 20 }}
      bodyStyle={{ padding: 0 }}
      className="search-modal"
    >
      <div className="p-6">
        {/* Search Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Search Products</h2>
          <Button type="text" icon={<CloseOutlined />} onClick={handleClose} size="large" className="hover:bg-gray-100" />
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <Search
            placeholder="Search for products, categories, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearchSubmit}
            enterButton={<SearchOutlined />}
            size="large"
            autoFocus
            className="w-full"
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="text-center py-8">
                <Spin size="large" />
                <p className="mt-4 text-gray-500">Searching for "{searchQuery}"...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Search Results ({searchResults.length})</h3>
                  <Button
                    type="link"
                    onClick={() => handleSearchSubmit(searchQuery)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    View All Results
                  </Button>
                </div>
                <List
                  dataSource={searchResults}
                  renderItem={(item) => (
                    <List.Item
                      className="cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors border-b border-gray-100"
                      onClick={() => handleResultClick(item)}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={item.images?.[0]} size={60} shape="square" className="object-cover" />}
                        title={
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            {item.averageRating > 0 && (
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-sm text-gray-600">
                                  {item.averageRating} ({item.reviewCount})
                                </span>
                              </div>
                            )}
                          </div>
                        }
                        description={
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-blue-600">${item.price}</span>
                              <Tag color="blue" size="small">
                                {item.category.name}
                              </Tag>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg">No products found for "{searchQuery}"</p>
                <p className="text-sm text-gray-400 mt-2">Try different keywords or browse categories</p>
              </div>
            )}
          </div>
        )}

        {/* Recent Searches */}
        {!searchQuery && recentSearches.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <ClockCircleOutlined className="text-gray-400" />
              <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Button
                  key={index}
                  size="small"
                  onClick={() => handleRecentSearchClick(search)}
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        {!searchQuery && (
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FireOutlined className="text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Popular Categories</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: "Electronics", icon: "📱" },
                { name: "Clothing", icon: "👕" },
                { name: "Home & Garden", icon: "🏠" },
                { name: "Books", icon: "📚" },
                { name: "Sports", icon: "⚽" },
                { name: "Beauty", icon: "💄" },
                { name: "Toys", icon: "🧸" },
                { name: "Automotive", icon: "🚗" },
              ].map((category) => (
                <Button
                  key={category.name}
                  type="text"
                  className="text-left h-auto p-4 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg transition-all"
                  onClick={() => {
                    handleClose();
                    router.push(`/categories`);
                  }}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-medium text-gray-900">{category.name}</div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
