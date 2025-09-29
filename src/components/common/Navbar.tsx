import React, { useMemo } from "react";
import { Row, Col, Button, Space, Typography, Avatar } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../features/auth/authSlice";

const { Text } = Typography;

const Navbar: React.FC = () => {
  const { users } = useSelector((state: RootState) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailId = useMemo(
    () => localStorage.getItem("email") || sessionStorage.getItem("email"),
    []
  );

  const currentUser = useMemo(
    () => users.find((user) => user.email === emailId),
    [users, emailId]
  );

  const handleLogout = () => {
    dispatch(clearAuth());
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("email");
    sessionStorage.removeItem("email");
    navigate("/");
  };

  return (
    <Row
      justify="space-between"
      align="middle"
      style={{
        padding: "0 20px",
        backgroundColor: "#001529",
        color: "#fff",
        height: 64,
      }}
    >
      <Col>
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: 500 }}>
          My App
        </Text>
      </Col>
      <Col>
        <Space size="middle">
          <Avatar icon={<UserOutlined />} />
          <Text style={{ color: "#fff" }}>
            {currentUser?.first_name || currentUser?.email || "User"}
          </Text>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            title="Logout"
          />
        </Space>
      </Col>
    </Row>
  );
};

export default Navbar;
