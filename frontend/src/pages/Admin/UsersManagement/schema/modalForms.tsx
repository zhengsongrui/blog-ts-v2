import React from "react";
import { Form, Input, Select } from "antd";
import type { CreateUserDto, UpdateUserDto } from "@/api/types";

const { Option } = Select;

export const renderUserForm = () => {
  return (
    <>
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: "请输入用户名" }, { max: 50, message: "用户名不能超过50个字符" }]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item
        label="邮箱"
        name="email"
        rules={[
          { required: true, message: "请输入邮箱" },
          { type: "email", message: "请输入有效的邮箱地址" },
        ]}
      >
        <Input placeholder="例如: user@example.com" />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          { required: false, message: "请输入密码" },
          { min: 6, message: "密码长度至少6位" },
          { max: 20, message: "密码长度不能超过20位" },
        ]}
        extra="留空表示不修改密码"
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>

      <Form.Item
        label="角色"
        name="role"
        rules={[{ required: true, message: "请选择角色" }]}
      >
        <Select placeholder="请选择角色">
          <Option value="USER">普通用户</Option>
          <Option value="EDITOR">编辑</Option>
          <Option value="ADMIN">管理员</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="头像URL"
        name="avatar"
        rules={[{ type: "url", message: "请输入有效的URL地址" }]}
      >
        <Input placeholder="例如: https://example.com/avatar.jpg" />
      </Form.Item>

      <Form.Item
        label="简介"
        name="bio"
        rules={[{ max: 200, message: "简介不能超过200个字符" }]}
      >
        <Input.TextArea placeholder="请输入用户简介（可选）" rows={3} showCount maxLength={200} />
      </Form.Item>
    </>
  );
};