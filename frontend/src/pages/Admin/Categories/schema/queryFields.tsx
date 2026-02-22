import React from "react";
import { Input } from "antd";
import type { QueryFieldItem } from "@/types";

// 分类查询字段
export const renderCategoryQueryFields = ({}): QueryFieldItem[] => [
  {
    name: "name",
    label: "分类名称",
    span: 6,
    component: <Input placeholder="请输入分类名称" />,
  },
  {
    name: "slug",
    label: "分类Slug",
    span: 6,
    component: <Input placeholder="请输入分类Slug" />,
  },
];