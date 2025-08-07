"use client";

import { useState } from "react";
import { Card, Row, Col, Form, Input, Button, Typography, message, Divider } from "antd";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, ClockCircleOutlined, SendOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: ContactForm) => {
    setLoading(true);
    try {
      // TODO: Implement actual contact form submission
      console.log("Contact form submitted:", values);
      message.success("Thank you for your message! We will get back to you soon.");
      form.resetFields();
    } catch (error) {
      message.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Title level={1} className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </Title>
          <Paragraph className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help! Reach out to us and we'll get back to you as soon as possible.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {/* Contact Form */}
          <Col xs={24} lg={14}>
            <Card className="h-full">
              <Title level={3} className="mb-6">
                Send us a Message
              </Title>
              <Form form={form} layout="vertical" onFinish={onFinish} size="large">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label="Full Name"
                      rules={[
                        { required: true, message: "Please enter your name!" },
                        { min: 2, message: "Name must be at least 2 characters!" },
                      ]}
                    >
                      <Input placeholder="Enter your full name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[
                        { required: true, message: "Please enter your email!" },
                        { type: "email", message: "Please enter a valid email!" },
                      ]}
                    >
                      <Input placeholder="Enter your email address" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="subject"
                  label="Subject"
                  rules={[
                    { required: true, message: "Please enter a subject!" },
                    { min: 5, message: "Subject must be at least 5 characters!" },
                  ]}
                >
                  <Input placeholder="What is this about?" />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="Message"
                  rules={[
                    { required: true, message: "Please enter your message!" },
                    { min: 10, message: "Message must be at least 10 characters!" },
                  ]}
                >
                  <TextArea rows={6} placeholder="Tell us more about your inquiry..." />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SendOutlined />}
                    size="large"
                    className="w-full h-12 text-base font-medium"
                  >
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col xs={24} lg={10}>
            <div className="space-y-6">
              <Card>
                <Title level={3} className="mb-6">
                  Get in Touch
                </Title>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MailOutlined className="text-2xl text-blue-600 mt-1" />
                    <div>
                      <div className="font-semibold text-gray-900">Email</div>
                      <div className="text-gray-600">support@ecommerce.com</div>
                      <div className="text-gray-600">sales@ecommerce.com</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <PhoneOutlined className="text-2xl text-green-600 mt-1" />
                    <div>
                      <div className="font-semibold text-gray-900">Phone</div>
                      <div className="text-gray-600">+1 (555) 123-4567</div>
                      <div className="text-gray-600">+1 (555) 987-6543</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <EnvironmentOutlined className="text-2xl text-red-600 mt-1" />
                    <div>
                      <div className="font-semibold text-gray-900">Address</div>
                      <div className="text-gray-600">
                        123 Commerce Street
                        <br />
                        Business District
                        <br />
                        New York, NY 10001
                        <br />
                        United States
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <ClockCircleOutlined className="text-2xl text-purple-600 mt-1" />
                    <div>
                      <div className="font-semibold text-gray-900">Business Hours</div>
                      <div className="text-gray-600">
                        Monday - Friday: 9:00 AM - 6:00 PM
                        <br />
                        Saturday: 10:00 AM - 4:00 PM
                        <br />
                        Sunday: Closed
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <Title level={4} className="mb-4">
                  Frequently Asked Questions
                </Title>
                <div className="space-y-3">
                  <div className="border-b border-gray-200 pb-3">
                    <div className="font-semibold text-gray-900">How can I track my order?</div>
                    <div className="text-gray-600 text-sm">
                      You can track your order by logging into your account and visiting the "My Orders" section.
                    </div>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <div className="font-semibold text-gray-900">What is your return policy?</div>
                    <div className="text-gray-600 text-sm">
                      We offer a 30-day return policy for most items. Please check the product page for specific details.
                    </div>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <div className="font-semibold text-gray-900">Do you ship internationally?</div>
                    <div className="text-gray-600 text-sm">
                      Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">How can I change my shipping address?</div>
                    <div className="text-gray-600 text-sm">
                      You can update your shipping address in your account settings or during checkout.
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Map Section */}
        <Card className="mt-8">
          <Title level={3} className="mb-6">
            Find Us
          </Title>
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <div className="text-gray-600">Interactive map will be displayed here</div>
              <div className="text-sm text-gray-500">Google Maps integration</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
