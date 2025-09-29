import React, { useState, useMemo, memo } from "react";
import { Card, Avatar, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

interface Props {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

const UserCard: React.FC<Props> = ({ user, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  // Memoize full name to avoid recalculating on every render
  const fullName = useMemo(
    () => `${user.first_name} ${user.last_name}`,
    [user.first_name, user.last_name]
  );

  // Handlers wrapped in useMemo to avoid re-creating on each render
  const handleEdit = useMemo(
    () => (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit && onEdit(user);
    },
    [onEdit, user]
  );

  const handleDelete = useMemo(
    () => (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete && onDelete(user);
    },
    [onDelete, user]
  );

  return (
    <Card
      hoverable
      style={{
        width: 260,
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        textAlign: "center",
        userSelect: "none",
        margin: "auto",
        position: "relative", // for overlay positioning
        paddingTop: 32, paddingBottom: 16
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.51)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            transition: "all 0.2s",
            zIndex: 999,
          }}
        >
          {onEdit && (
            <Tooltip title="Edit User">
              <div
                style={{
                  background: "#7265e6",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={handleEdit}
              >
                <EditOutlined style={{ color: "#fff", fontSize: 20 }} />
              </div>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete User">
              <div
                style={{
                  background: "#ff4d4f",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={handleDelete}
              >
                <DeleteOutlined style={{ color: "#fff", fontSize: 20 }} />
              </div>
            </Tooltip>
          )}
        </div>
      )}

      <div
        style={{
          position: "relative",
          width: 100,
          margin: "auto",
          marginBottom: 16,
        }}
      >
        <Avatar size={100} src={user.avatar} />
      </div>
      <Card.Meta
        title={<span style={{ fontWeight: 500 }}>{fullName}</span>}
        description={<span style={{ color: "#888" }}>{user.email}</span>}
      />
    </Card>
  );
};

// Memoize component to prevent unnecessary re-renders
export default memo(UserCard);
