import { Input, Select } from "antd";
import type { QueryFieldItem } from "@/types";
import { POST_STATUS } from "@/config/constants";

// 分类选项类型
export interface CategoryOption {
  id: string;
  name: string;
  slug?: string;
}

// 标签选项类型
export interface TagOption {
  id: string;
  name: string;
  slug?: string;
}

// 作者选项类型
export interface AuthorOption {
  id: string;
  username: string;
  email?: string;
}

// 文章列表查询字段
export const renderPostListQueryFields = ({
  categories = [] as CategoryOption[],
  tags = [] as TagOption[],
  authors = [] as AuthorOption[],
}: {
  categories?: CategoryOption[];
  tags?: TagOption[];
  authors?: AuthorOption[];
}): QueryFieldItem[] => [
  {
    name: "title",
    label: "文章标题",
    span: 6,
    component: <Input placeholder="请输入文章标题关键词" allowClear />,
  },
  {
    name: "categoryId",
    label: "分类",
    span: 6,
    component: (
      <Select placeholder="请选择分类" allowClear showSearch optionFilterProp="label">
        {categories.map((cat) => (
          <Select.Option key={cat.id} value={cat.id} label={cat.name}>
            {cat.name}
          </Select.Option>
        ))}
      </Select>
    ),
  },
  {
    name: "tagId",
    label: "标签",
    span: 6,
    component: (
      <Select placeholder="请选择标签" allowClear showSearch optionFilterProp="label">
        {tags.map((tag) => (
          <Select.Option key={tag.id} value={tag.id} label={tag.name}>
            {tag.name}
          </Select.Option>
        ))}
      </Select>
    ),
  },
  {
    name: "authorId",
    label: "作者",
    span: 6,
    component: (
      <Select placeholder="请选择作者" allowClear showSearch optionFilterProp="label">
        {authors.map((author) => (
          <Select.Option key={author.id} value={author.id} label={author.username}>
            {author.username}
          </Select.Option>
        ))}
      </Select>
    ),
  },
  // 状态筛选（可选，默认为已发布）
  {
    name: "status",
    label: "状态",
    span: 6,
    component: (
      <Select placeholder="请选择状态" allowClear defaultValue={POST_STATUS.PUBLISHED}>
        <Select.Option value={POST_STATUS.DRAFT}>草稿</Select.Option>
        <Select.Option value={POST_STATUS.PUBLISHED}>已发布</Select.Option>
        <Select.Option value={POST_STATUS.ARCHIVED}>已归档</Select.Option>
      </Select>
    ),
  },
];