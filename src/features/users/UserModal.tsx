import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useAppDispatch } from "../../store/hooks";
import { createUser, updateUser } from "./userSlice";
import type { User } from "../../types/user";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  editingUser?: User | null;
  title?: string;
}

const UserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  editingUser,
}) => {
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  useEffect(() => {
    if (editingUser) {
      form.setFieldsValue(editingUser);
    } else {
      form.resetFields();
    }
  }, [editingUser, form]);

  // Validate HTTPS image URLs only
  const isValidImageUrl = (url: string) =>
    /^https:\/\/.*\.(jpeg|jpg|gif|png|webp)$/i.test(url);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Validate avatar URL locally
      if (values.avatar && !isValidImageUrl(values.avatar)) {
        message.error(
          "Please enter a valid HTTPS image URL (jpg, jpeg, png, gif, webp)"
        );
        return;
      }

      let response;

      if (editingUser) {
        // Update user
        response = await dispatch(updateUser({ ...editingUser, ...values }));
        if (updateUser.rejected.match(response)) {
          throw new Error(response.payload as string);
        }
        message.success("User updated successfully!");
      } else {
        // Create user
        response = await dispatch(createUser(values));
        if (createUser.rejected.match(response)) {
          throw new Error(response.payload as string);
        }
        message.success("User created successfully!");
      }

      form.resetFields();
      onClose();
    } catch (error: any) {
      const errorMessage = error.message || "Failed to submit user data.";
      message.error(errorMessage);
    }
  };

  return (
    <Modal
      title={editingUser ? "Edit User" : "Create User"}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      forceRender={true}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="first_name"
          label="First Name"
          rules={[{ required: true, message: "Please enter first name" }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Last Name"
          rules={[{ required: true, message: "Please enter last name" }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, type: "email", message: "Enter valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="avatar"
          label="Avatar URL"
          rules={[
            {
              required: true,
              type: "url",
              message: "Enter valid Image Link ",
            },
          ]}
        >
          <Input placeholder="Profile Image Link" />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>
            {editingUser ? "Update" : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UserModal; 