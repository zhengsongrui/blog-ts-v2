/**
 * 用户管理页面
 * 管理员可以查看、创建、编辑、删除用户
 * 使用新的架构模式，参考分类管理页面
 */

import React, { useCallback, useRef } from "react";
import { renderUserColumns } from "./schema/tableColumns";
import { renderUserQueryFields } from "./schema/queryFields";
import QueryFilter from "@/components/QueryFilter";
import BaseTable from "@/components/BaseTable";
import useQueryFilter from "@/hooks/useQueryFilter";
import useTableRequest from "@/hooks/useTableRequest";
import EditUserModal from "@/components/FormModal";
import type { FormModalRef } from "@/components/FormModal/types";
import { renderUserForm } from "./schema/modalForms";
import { userApi } from "@/api/endpoints/user.api";
import type { ApiResponseUser } from "@/api/types/user.types";
import { Button } from "antd";

const Users: React.FC = () => {
  const query = useQueryFilter({});

  /** * 表格请求 Hook
   */
  const table = useTableRequest({
    request: userApi.getUsers,
    params: query.getParams(),
  });
  const handleEdit = useCallback((record: ApiResponseUser) => {
    modalRef.current?.open({
      title: "编辑用户",
      record,
      api: (data) => userApi.updateUser(record.id, data),
    });
  }, []);

  const handleDelete = useCallback((record: ApiResponseUser) => {
    userApi.deleteUser(record.id).then(() => {
      table.reload();
    });
  }, []);

  // modal表单相关
  const modalRef = useRef<FormModalRef>(null);
  return (
    <div>
      <QueryFilter
        fields={renderUserQueryFields({})}
        onChange={query.onChange}
        onSearch={() => {
          table.reload(query.getParams());
        }}
        onReset={() => {
          query.reset();
          table.reload(query.getParams());
        }}
        leftActions={
          <Button
            type="primary"
            onClick={() => {
              modalRef.current?.open({
                title: "新增用户",
                record: {},
                api: userApi.register,
              });
            }}
          >
            新增用户
          </Button>
        }
      />

      <BaseTable
        columns={renderUserColumns({
          EditAction: handleEdit,
          DeleteAction: handleDelete,
        })}
        dataSource={table.data}
        loading={table.loading}
        pagination={table.pagination}
      />
      <EditUserModal
        ref={modalRef}
        onSuccess={table.reload}
        renderForm={renderUserForm}
      />
    </div>
  );
};

export default Users;