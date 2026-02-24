import { useMemo } from "react";
import type { Post } from "@/api/types";
import { Link } from "react-router-dom";
import { Image, Tag as AntTag } from "antd";
import { POST_STATUS_LABEL } from "@/config/constants";
import styles from "./postsList.module.less";

// 文章列表列定义钩子
export const usePostListColumns = () => {
  return useMemo(
    () => [
      {
        title: "文章标题",
        dataIndex: "title",
        key: "title",
        width: 250,
        render: (_: unknown, record: Post) => (
          <Link to={`/posts/${record.id}`} className={styles['title-link']}>
            {record.title}
          </Link>
        ),
      },
      {
        title: "摘要",
        dataIndex: "excerpt",
        key: "excerpt",
        width: 300,
        render: (excerpt: string | null) => excerpt || "暂无摘要",
      },
      {
        title: "封面图",
        dataIndex: "featuredImage",
        key: "featuredImage",
        width: 100,
        render: (image: string | null) =>
          image ? (
            <Image
              src={image}
              alt="封面"
              width={60}
              height={40}
              style={{ objectFit: "cover", borderRadius: 4 }}
              preview={false}
            />
          ) : (
            "无"
          ),
      },
      {
        title: "作者",
        dataIndex: "author",
        key: "author",
        width: 120,
        render: (_: unknown, record: Post) => record.author?.username || "未知",
      },
      {
        title: "分类",
        dataIndex: "categories",
        key: "categories",
        width: 150,
        render: (categories: Post["categories"]) =>
          categories?.map((cat) => (
            <AntTag key={cat.id} color="blue" style={{ marginBottom: 4 }}>
              {cat.name}
            </AntTag>
          )) || "无",
      },
      {
        title: "标签",
        dataIndex: "tags",
        key: "tags",
        width: 200,
        render: (tags: Post["tags"]) =>
          tags?.map((tag) => (
            <AntTag key={tag.id} color="green" style={{ marginBottom: 4, marginRight: 4 }}>
              {tag.name}
            </AntTag>
          )) || "无",
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: 80,
        render: (status: Post["status"]) => POST_STATUS_LABEL[status] || status,
      },
      {
        title: "浏览量",
        dataIndex: "views",
        key: "views",
        width: 80,
      },
      {
        title: "发布时间",
        dataIndex: "publishedAt",
        key: "publishedAt",
        width: 150,
        render: (publishedAt: string | null) =>
          publishedAt ? new Date(publishedAt).toLocaleString() : "未发布",
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 150,
        render: (createdAt: string) => new Date(createdAt).toLocaleString(),
      },
    ],
    [],
  );
};