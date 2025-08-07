"use client";

import { useDispatch } from "react-redux";
import { toggleCartDrawer, toggleSearchModal } from "@/store/slices/uiSlice";
import { Button } from "antd";

export default function TestPage() {
  const dispatch = useDispatch();

  return (
    <div className="container-custom py-16">
      <h1 className="text-4xl font-bold mb-8">Component Test Page</h1>

      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="text-2xl font-semibold mb-4">Layout Components Test</h2>
          <p className="text-gray-600 mb-4">This page tests the Layout component with CartDrawer and SearchModal.</p>

          <div className="flex space-x-4">
            <Button type="primary" size="large" onClick={() => dispatch(toggleCartDrawer())}>
              Open Cart Drawer
            </Button>

            <Button type="default" size="large" onClick={() => dispatch(toggleSearchModal())}>
              Open Search Modal
            </Button>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Click "Open Cart Drawer" to test the shopping cart drawer functionality</li>
            <li>Click "Open Search Modal" to test the search modal functionality</li>
            <li>You can also click the cart icon or search icon in the header</li>
            <li>The components should open and close properly</li>
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-semibold mb-4">Expected Behavior</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Cart Drawer should slide in from the right side</li>
            <li>Search Modal should open as a centered modal</li>
            <li>Both components should be dismissible</li>
            <li>Header navigation should work properly</li>
            <li>Footer should be visible at the bottom</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
