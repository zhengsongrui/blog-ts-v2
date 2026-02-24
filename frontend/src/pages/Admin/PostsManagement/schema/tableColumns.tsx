import { useMemo } from "react";
import type { Post } from "@/api/types";
import { Popconfirm } from "antd";
import styles from "@/components/BaseTable/tableActions.module.less";
import { POST_STATUS_LABEL } from "@/config/constants";

export const renderPostColumns = ({ EditAction, DeleteAction }: {
  EditAction: (record: Post) => void;
  DeleteAction: (record: Post) => void;
}) => {
  return useMemo(
    () => [
      {
        title: "文章ID",
        dataIndex: "id",
        key: "id",
        width: 200,
        ellipsis: true,
      },
      {
        title: "标题",
        dataIndex: "title",
        key: "title",
        width: 200,
        ellipsis: true,
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (_: any, record: Post) => POST_STATUS_LABEL[record.status] || record.status,
      },
      {
        title: "浏览量",
        dataIndex: "viewCount",
        key: "viewCount",
        width: 100,
      },
      {
        title: "作者",
        dataIndex: "author",
        key: "author",
        width: 150,
        render: (_: any, record: Post) => record.author?.username || "未知",
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 180,
        render: (_: any, record: Post) => new Date(record.createdAt).toLocaleString(),
      },
      {
        title: "更新时间",
        dataIndex: "updatedAt",
        key: "updatedAt",
        width: 180,
        render: (_: any, record: Post) => new Date(record.updatedAt).toLocaleString(),
      },
      {
        title: "操作",
        key: "action",
        width: 180,
        render: (_: any, record: Post) => (
          <div className={styles.actionContainer}>
            <a
              className={styles.editLink}
              onClick={() => EditAction(record)}
            >
              编辑
            </a>
            <Popconfirm
              title="提示"
              description="是否删除该文章？删除后不可恢复，请谨慎操作。"
              onConfirm={() => DeleteAction(record)}
              okText="是"
              cancelText="否"
            >
              <a className={styles.deleteLink}>删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ],
    [EditAction, DeleteAction],
  );
};