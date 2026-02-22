import { Input } from "antd";
import type { QueryFieldItem } from "@/types";

// 标签查询字段
export const renderTagQueryFields = ({}): QueryFieldItem[] => [
  {
    name: "name",
    label: "标签名称",
    span: 6,
    component: <Input placeholder="请输入标签名称" />,
  },
  {
    name: "slug",
    label: "标签Slug",
    span: 6,
    component: <Input placeholder="请输入标签Slug" />,
  },
];
