import  { useMemo } from "react";
import type { Tag } from "@/api/types";
import { Popconfirm } from "antd";
import styles from "@/components/BaseTable/tableActions.module.less";

export const renderTagColumns = ({ EditAction, DeleteAction }: {
  EditAction: (record: Tag) => void;
  DeleteAction: (record: Tag) => void;
}) => {
  return useMemo(
    () => [
      {
        title: "标签ID",
        dataIndex: "id",
        key: "id",
        width: 200,
        ellipsis: true,
      },
      {
        title: "标签名称",
        dataIndex: "name",
        key: "name",
        width: 150,
      },
      {
        title: "标签Slug",
        dataIndex: "slug",
        key: "slug",
        width: 150,
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 180,
        render: (_: any, record: Tag) => new Date(record.createdAt).toLocaleString(),
      },
      {
        title: "更新时间",
        dataIndex: "updatedAt",
        key: "updatedAt",
        width: 180,
        render: (_: any, record: Tag) => new Date(record.updatedAt).toLocaleString(),
      },
      {
        title: "操作",
        key: "action",
        width: 180,
        render: (_: any, record: Tag) => (
          <div className={styles.actionContainer}>
            <a
              className={styles.editLink}
              onClick={() => EditAction(record)}
            >
              编辑
            </a>
            <Popconfirm
              title="提示"
              description="是否删除该标签？删除后不可恢复，请谨慎操作。"
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
