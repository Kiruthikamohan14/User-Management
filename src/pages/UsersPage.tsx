import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  getAllUsers,
  setPage,
  setSearch,
  deleteUser,
} from "../features/users/userSlice";
import {
  Spin,
  Tabs,
  Row,
  Col,
  Input,
  Space,
  Modal,
  message,
  Empty,
} from "antd";
import { TableOutlined, MenuOutlined } from "@ant-design/icons";
import Navbar from "../components/common/Navbar";
import UserTable from "../features/users/UserTable";
import UserCard from "../features/users/UserCard";
import Button from "../components/common/Button";
import UserModal from "../features/users/UserModal";
import type { User } from "../types/user";

export default function UsersPage() {
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, page, totalPages, search } = useSelector(
    (state: RootState) => state.users
  );
  const [view, setView] = useState("table");

  // Local search state for debounce
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearch(localSearch));
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);

  // --- Edit handler ---

  const handleEdit = useCallback((user: User) => {
    setEditingUser(user);
    setModalVisible(true);
  }, []); // no dependencies

  const handleDelete = useCallback(
    (user: User) => {
      Modal.confirm({
        title: "Are you sure you want to delete this user?",
        content: `${user.first_name} ${user.last_name}`,
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            const response = await dispatch(deleteUser(user.id));
            if (deleteUser.rejected.match(response)) {
              throw new Error(response.payload as string);
            }
            message.success(
              `Deleted user: ${user.first_name} ${user.last_name}`
            );
          } catch (error: any) {
            message.error(error.message || "Failed to delete user.");
          }
        },
      });
    },
    [dispatch]
  ); // dispatch is stable from Redux, include it

  // Spinner component
  const SpinLoader = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <Spin size="large" />
    </div>
  );

  // Memoized Table View
  const tableView = useMemo(
    () => (
      <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
    ),
    [users, handleEdit, handleDelete]
  );

  // Memoized Card View
  const cardView = useMemo(
    () =>
      users.length > 0 ? (
        <Row gutter={[16, 16]} justify="center">
          {users.map((user) => (
            <Col
              key={user.id}
              xs={24}
              sm={12}
              md={8}
              lg={6} 
              xl={4} 
              style={{ display: "flex", justifyContent: "center" }}
            >
              <UserCard
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 40 }}
        >
          <Empty description="No Data" />
        </div>
      ),
    [users, handleEdit, handleDelete]
  );

  // Memoized Pagination Buttons
  const pageButtons = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => {
      const pageNumber = i + 1;
      const isActive = page === pageNumber;
      return (
        <Button
          key={pageNumber}
          onClick={() => dispatch(setPage(pageNumber))}
          type="default"
          style={{
            margin: 4,
            border: isActive ? "2px solid #1890ff" : "1px solid #d9d9d9",
            borderRadius: 0,
            backgroundColor: isActive ? "#e6f7ff" : "#fff",
          }}
        >
          {pageNumber}
        </Button>
      );
    });
  }, [totalPages, page, dispatch]);

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: 20,
          margin: "30px 20px 5px 20px",
          backgroundColor: "#ffffff",
        }}
      >
        <Row justify="space-between">
          <Col>
            <h2>Users</h2>
          </Col>
          <Col>
            <Space>
              <Input.Search
                placeholder="input search text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                allowClear
                style={{ width: 200 }}
              />
              <Button
                type="primary"
                onClick={() => {
                  setEditingUser(undefined);
                  setModalVisible(true);
                }}
              >
                Create User
              </Button>
            </Space>
          </Col>
        </Row>

        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Tabs
              activeKey={view}
              onChange={setView}
              items={[
                { label: "Table", key: "table", icon: <TableOutlined /> },
                { label: "Card", key: "card", icon: <MenuOutlined /> },
              ]}
            />
          </Col>
        </Row>

        {loading ? SpinLoader() : view === "table" ? tableView : cardView}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Row justify="end" style={{ margin: 20, alignItems: "center" }}>
          <Button
            onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
            disabled={page === 1}
            style={{ borderRadius: 0 }}
          >
            &lt;
          </Button>
          {pageButtons}
          <Button
            onClick={() => dispatch(setPage(Math.min(totalPages, page + 1)))}
            disabled={page === totalPages}
            style={{ borderRadius: 0 }}
          >
            &gt;
          </Button>
        </Row>
      )}

      {/* Reusable Create/Edit Modal */}
      <UserModal
        open={modalVisible}
        editingUser={editingUser}
        onClose={() => setModalVisible(false)}
        title={editingUser ? "Edit User" : "Create User"}
      />
    </>
  );
}
