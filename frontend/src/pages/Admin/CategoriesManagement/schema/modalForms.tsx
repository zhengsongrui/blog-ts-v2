import React from "react";
import { Form, Input } from "antd";
import type { CreateCategoryDto } from "@/api/types";

export const renderCategoryForm = () => {
  return (
    <>
      <Form.Item
        label="分类名称"
        name="name"
        rules={[{ required: true, message: "请输入分类名称" }, { max: 50, message: "名称不能超过50个字符" }]}
      >
        <Input placeholder="请输入分类名称" />
      </Form.Item>

      <Form.Item
        label="分类Slug"
        name="slug"
        rules={[
          { required: true, message: "请输入分类Slug" },
          { pattern: /^[a-z0-9\-]+$/, message: "Slug只能包含小写字母、数字和连字符" },
        ]}
      >
        <Input placeholder="例如: technology" />
      </Form.Item>

      <Form.Item
        label="描述"
        name="description"
        rules={[{ max: 200, message: "描述不能超过200个字符" }]}
      >
        <Input.TextArea placeholder="请输入分类描述（可选）" rows={3} showCount maxLength={200} />
      </Form.Item>
    </>
  );
};