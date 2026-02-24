import React from "react";
import { Input, Select } from "antd";
import type { QueryFieldItem } from "@/types";

const { Option } = Select;

// 用户查询字段
export const renderUserQueryFields = ({}): QueryFieldItem[] => [
  {
    name: "username",
    label: "用户名",
    span: 6,
    component: <Input placeholder="请输入用户名" />,
  },
  {
    name: "email",
    label: "邮箱",
    span: 6,
    component: <Input placeholder="请输入邮箱" />,
  },
  {
    name: "role",
    label: "角色",
    span: 6,
    component: (
      <Select placeholder="请选择角色" allowClear>
        <Option value="USER">普通用户</Option>
        <Option value="EDITOR">编辑</Option>
        <Option value="ADMIN">管理员</Option>
      </Select>
    ),
  },
];