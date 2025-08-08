"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { Form, Input, Button, Card, message, Divider, Checkbox } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import Link from "next/link";
import { register } from "@/store/slices/authSlice";

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  agreeToTerms: boolean;
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onFinish = async (values: RegisterForm) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, agreeToTerms, ...registerData } = values;
      await dispatch(register(registerData) as any);
      message.success("Registration successful! Please check your email for verification.");
      router.push("/login");
    } catch (error: any) {
      message.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <Card className="shadow-lg">
          <Form name="register" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: "Please input your first name!" },
                { min: 2, message: "First name must be at least 2 characters!" },
              ]}
            >
              <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Enter your first name" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[
                { required: true, message: "Please input your last name!" },
                { min: 2, message: "Last name must be at least 2 characters!" },
              ]}
            >
              <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Enter your last name" />
            </Form.Item>

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
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: "Please input your phone number!" },
                { pattern: /^[+]?[\d\s\-\(\)]+$/, message: "Please enter a valid phone number!" },
              ]}
            >
              <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="Enter your phone number" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
            >
              <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Create a password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              rules={[{ required: true, message: "Please confirm your password!" }]}
            >
              <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Confirm your password" />
            </Form.Item>

            <Form.Item
              name="agreeToTerms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error("You must agree to the terms and conditions")),
                },
              ]}
            >
              <Checkbox>
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} className="w-full h-12 text-base font-medium">
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <Divider>Or</Divider>

          <div className="text-center">
            <p className="text-sm text-gray-600">By creating an account, you agree to our terms of service and privacy policy.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
