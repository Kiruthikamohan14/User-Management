import { Table, Button, Avatar } from "antd";
import type { ColumnsType } from "antd/es/table";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const columns: ColumnsType<User> = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: string) => <Avatar src={avatar} />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <a href={`mailto:${email}`} style={{ color: "#1890ff" }}>
          {email}
        </a>
      ),
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, user: User) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="primary"
            size="small"
            style={{ fontSize: 10, borderRadius: 0 }}
            onClick={() => onEdit(user)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            style={{ fontSize: 10, borderRadius: 0 }}
            onClick={() => onDelete(user)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table<User>
      rowKey="id"
      columns={columns}
      dataSource={users}
      pagination={false}
      scroll={{ x: "max-content" }}
    />
  );
}
