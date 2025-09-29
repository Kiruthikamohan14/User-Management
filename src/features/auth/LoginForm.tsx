// src/features/auth/LoginForm.tsx
import React, { useEffect } from "react";
import { Form, Input, Button, Card, Alert, Checkbox, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../components/common/LoadingProvider";
import type { LoginCredentials } from "../../types/auth";
import type { AppDispatch, RootState } from "../../store/store";

const defaultCreds: LoginCredentials = {
  email: process.env.REACT_APP_DEFAULT_EMAIL || "",
  password: process.env.REACT_APP_DEFAULT_PASSWORD || "",
};

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { token, error, loading } = useSelector(
    (state: RootState) => state.auth
  );

  // Redirect automatically if already logged in
  useEffect(() => {
    if (token) navigate("/users", { replace: true });
  }, [token, navigate]);

  const onFinish = async (
    values: LoginCredentials & { remember?: boolean }
  ) => {
    setLoading(true);
    try {
      // Dispatch login thunk
      const userToken: string = await dispatch(login(values)).unwrap();

      // Persist token if "remember me" is checked
      if (userToken && values.remember) {
        localStorage.setItem("token", userToken);
      }

      navigate("/users", { replace: true });
    } catch (err: any) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "100vh", backgroundColor: "#e3e3e3" }}
    >
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card
          style={{ borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          {error && (
            <Alert type="error" message={error} style={{ marginBottom: 16 }} />
          )}
          <Form
            name="login"
            layout="vertical"
            initialValues={defaultCreds}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ marginBottom: 16 }}>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading} // optional, shows loading in button
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
