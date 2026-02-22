import React, { useMemo } from "react";
import type { Category } from "@/api/types";
import { Popconfirm } from "antd";
import styles from "@/components/BaseTable/tableActions.module.less";

export const renderCategoryColumns = ({ EditAction, DeleteAction }: {
  EditAction: (record: Category) => void;
  DeleteAction: (record: Category) => void;
}) => {
  return useMemo(
    () => [
      {
        title: "分类ID",
        dataIndex: "id",
        key: "id",
        width: 200,
        ellipsis: true,
      },
      {
        title: "分类名称",
        dataIndex: "name",
        key: "name",
        width: 150,
      },
      {
        title: "分类Slug",
        dataIndex: "slug",
        key: "slug",
        width: 150,
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
        render: (text: string | null) => text || '暂无描述',
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 180,
        render: (_: any, record: Category) => new Date(record.createdAt).toLocaleString(),
      },
      {
        title: "更新时间",
        dataIndex: "updatedAt",
        key: "updatedAt",
        width: 180,
        render: (_: any, record: Category) => new Date(record.updatedAt).toLocaleString(),
      },
      {
        title: "操作",
        key: "action",
        width: 180,
        render: (_: any, record: Category) => (
          <div className={styles.actionContainer}>
            <a
              className={styles.editLink}
              onClick={() => EditAction(record)}
            >
              编辑
            </a>
            <Popconfirm
              title="提示"
              description="是否删除该分类？删除后不可恢复，请谨慎操作。"
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