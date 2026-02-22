import { Input, Select } from "antd";
import type { QueryFieldItem } from "@/types";
import { POST_STATUS } from "@/config/constants";

// 文章查询字段
export const renderPostQueryFields = ({}): QueryFieldItem[] => [
  {
    name: "title",
    label: "文章标题",
    span: 6,
    component: <Input placeholder="请输入文章标题" />,
  },
  {
    name: "status",
    label: "文章状态",
    span: 6,
    component: (
      <Select placeholder="请选择文章状态" allowClear>
        <Select.Option value={POST_STATUS.DRAFT}>草稿</Select.Option>
        <Select.Option value={POST_STATUS.PUBLISHED}>已发布</Select.Option>
        <Select.Option value={POST_STATUS.ARCHIVED}>已归档</Select.Option>
      </Select>
    ),
  },
];