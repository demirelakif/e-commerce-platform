"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { Form, Input, Button, Card, message, Divider } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { login } from "@/store/slices/authSlice";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const result = await dispatch(login(values));
      if (login.fulfilled.match(result)) {
        message.success("Login successful!");
        router.push("/");
      } else if (login.rejected.match(result)) {
        message.error((result.payload as string) || "Login failed. Please try again.");
      }
    } catch (error: any) {
      message.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <Card className="shadow-lg">
          <Form name="login" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} className="w-full h-12 text-base font-medium">
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider>Or</Divider>

          <div className="text-center">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot your password?
            </Link>
          </div>
        </Card>

        <div className="text-center text-sm text-gray-600">
          <p>Demo Account: customer@demo.com / demo123</p>
        </div>
      </div>
    </div>
  );
}
