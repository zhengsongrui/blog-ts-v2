/**
 * 分类管理页面
 * 管理员可以查看、创建、编辑、删除分类
 * 使用新的架构模式，参考岗位管理页面
 */

import React, { useCallback, useRef } from "react";
import { renderCategoryColumns } from "./schema/tableColumns";
import { renderCategoryQueryFields } from "./schema/queryFields";
import QueryFilter from "@/components/QueryFilter";
import BaseTable from "@/components/BaseTable";
import useQueryFilter from "@/hooks/useQueryFilter";
import useTableRequest from "@/hooks/useTableRequest";
import EditCategoryModal from "@/components/FormModal";
import type { FormModalRef } from "@/components/FormModal/types";
import { renderCategoryForm } from "./schema/modalForms";
import {categoryApi} from "@/api/endpoints/category.api";
import type { ApiResponseCategory } from "@/api/types/category.types";
import { Button } from "antd";

const Categories: React.FC = () => {
  const query = useQueryFilter({});

  /** * 表格请求 Hook
   */
  const table = useTableRequest({
    request: categoryApi.getCategories,
    params: query.getParams(),
  });
  const handleEdit = useCallback((record: ApiResponseCategory) => {
    modalRef.current?.open({
      title: "编辑分类",
      record,
      api: (data) => categoryApi.updateCategory(record.id, data),
    });
  }, []);

  const handleDelete = useCallback((record: ApiResponseCategory) => {
    categoryApi.deleteCategory(record.id).then(() => {
      table.reload();
    });
  }, []);

  // modal表单相关
  const modalRef = useRef<FormModalRef>(null);
  return (
    <div>
      <QueryFilter
        fields={renderCategoryQueryFields({})}
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
                title: "新增分类",
                record: {},
                api: categoryApi.createCategory,
              });
            }}
          >
            新增分类
          </Button>
        }
      />

      <BaseTable
        columns={renderCategoryColumns({
          EditAction: handleEdit,
          DeleteAction: handleDelete,
        })}
        dataSource={table.data}
        loading={table.loading}
        pagination={table.pagination}
      />
      <EditCategoryModal
        ref={modalRef}
        onSuccess={table.reload}
        renderForm={renderCategoryForm}
      />
    </div>
  );
};

export default Categories;
