import React, { useMemo } from "react";
import type { User } from "@/api/types";
import { Popconfirm } from "antd";
import styles from "@/components/BaseTable/tableActions.module.less";

export const renderUserColumns = ({ EditAction, DeleteAction }: {
  EditAction: (record: User) => void;
  DeleteAction: (record: User) => void;
}) => {
  return useMemo(
    () => [
      {
        title: "用户ID",
        dataIndex: "id",
        key: "id",
        width: 200,
        ellipsis: true,
      },
      {
        title: "用户名",
        dataIndex: "username",
        key: "username",
        width: 120,
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email",
        width: 180,
      },
      {
        title: "角色",
        dataIndex: "role",
        key: "role",
        width: 100,
        render: (role: string) => {
          const roleMap: Record<string, string> = {
            USER: "普通用户",
            EDITOR: "编辑",
            ADMIN: "管理员",
          };
          return roleMap[role] || role;
        },
      },
      {
        title: "头像",
        dataIndex: "avatar",
        key: "avatar",
        width: 100,
        render: (avatar: string | null) => avatar ? (
          <img src={avatar} alt="avatar" style={{ width: 30, height: 30, borderRadius: '50%' }} />
        ) : '暂无',
      },
      {
        title: "简介",
        dataIndex: "bio",
        key: "bio",
        ellipsis: true,
        render: (text: string | null) => text || '暂无',
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 180,
        render: (_: any, record: User) => new Date(record.createdAt).toLocaleString(),
      },
      {
        title: "更新时间",
        dataIndex: "updatedAt",
        key: "updatedAt",
        width: 180,
        render: (_: any, record: User) => new Date(record.updatedAt).toLocaleString(),
      },
      {
        title: "操作",
        key: "action",
        width: 180,
        render: (_: any, record: User) => (
          <div className={styles.actionContainer}>
            <a
              className={styles.editLink}
              onClick={() => EditAction(record)}
            >
              编辑
            </a>
            <Popconfirm
              title="提示"
              description="是否删除该用户？删除后不可恢复，请谨慎操作。"
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