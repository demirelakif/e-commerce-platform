"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setCartDrawerOpen } from "@/store/slices/uiSlice";
import { CloseOutlined, DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Empty, InputNumber } from "antd";
import { useState } from "react";
import Link from "next/link";

export default function CartDrawer() {
  const dispatch = useDispatch<AppDispatch>();
  const ui = useSelector((state: RootState) => state.ui);
  const cart = useSelector((state: RootState) => state.cart);
  const cartDrawerOpen = ui?.cartDrawerOpen || false;
  const items = cart?.items || [];
  const itemCount = cart?.itemCount || 0;
  const total = cart?.total || 0;
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleClose = () => {
    dispatch(setCartDrawerOpen(false));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const handleRemoveItem = (productId: string) => {
    // TODO: Implement remove item from cart
    console.log("Remove item:", productId);
  };

  const handleCheckout = () => {
    handleClose();
    // TODO: Navigate to checkout page
    console.log("Navigate to checkout");
  };

  return (
    <Drawer
      title="Shopping Cart"
      placement="right"
      onClose={handleClose}
      open={cartDrawerOpen}
      width={400}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={handleClose} />}
    >
      {itemCount === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Your cart is empty" />
          <Link href="/products">
            <Button type="primary" className="mt-4">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.map((item) => (
              <div key={item._id} className="flex items-center space-x-3 p-3 border-b border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="text-gray-400 text-xs">No Image</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-gray-500 text-sm">${item.price}</p>

                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      type="text"
                      size="small"
                      icon={<MinusOutlined />}
                      onClick={() => handleQuantityChange(item._id, Math.max(1, (quantities[item._id] || item.quantity) - 1))}
                    />
                    <InputNumber
                      size="small"
                      min={1}
                      value={quantities[item._id] || item.quantity}
                      onChange={(value) => handleQuantityChange(item._id, value || 1)}
                      className="w-16"
                    />
                    <Button
                      type="text"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => handleQuantityChange(item._id, (quantities[item._id] || item.quantity) + 1)}
                    />
                  </div>
                </div>

                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveItem(item._id)}
                  className="text-red-500 hover:text-red-700"
                />
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total ({itemCount} items):</span>
              <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <Button type="primary" size="large" block onClick={handleCheckout}>
                Proceed to Checkout
              </Button>

              <Link href="/cart">
                <Button size="large" block onClick={handleClose}>
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
