/**
 * 标签管理页面
 * 管理员可以查看、创建、编辑、删除标签
 * 使用新的架构模式，参考分类管理页面
 */

import React, { useCallback, useRef } from "react";
import { renderTagColumns } from "./schema/tableColumns";
import { renderTagQueryFields } from "./schema/queryFields";
import QueryFilter from "@/components/QueryFilter";
import BaseTable from "@/components/BaseTable";
import useQueryFilter from "@/hooks/useQueryFilter";
import useTableRequest from "@/hooks/useTableRequest";
import EditTagModal from "@/components/FormModal";
import type { FormModalRef } from "@/components/FormModal/types";
import { renderTagForm } from "./schema/modalForms";
import {tagApi} from "@/api/endpoints/tag.api";
import type { ApiResponseTag } from "@/api/types/tag.types";
import { Button } from "antd";

const Tags: React.FC = () => {
  const query = useQueryFilter({});

  /** * 表格请求 Hook
   */
  const table = useTableRequest({
    request: tagApi.getTags,
    params: query.getParams(),
  });
  const handleEdit = useCallback((record: ApiResponseTag) => {
    modalRef.current?.open({
      title: "编辑标签",
      record,
      api: (data) => tagApi.updateTag(record.id, data),
    });
  }, []);

  const handleDelete = useCallback((record: ApiResponseTag) => {
    tagApi.deleteTag(record.id).then(() => {
      table.reload();
    });
  }, []);

  // modal表单相关
  const modalRef = useRef<FormModalRef>(null);
  return (
    <div>
      <QueryFilter
        fields={renderTagQueryFields({})}
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
                title: "新增标签",
                record: {},
                api: tagApi.createTag,
              });
            }}
          >
            新增标签
          </Button>
        }
      />

      <BaseTable
        columns={renderTagColumns({
          EditAction: handleEdit,
          DeleteAction: handleDelete,
        })}
        dataSource={table.data}
        loading={table.loading}
        pagination={table.pagination}
      />
      <EditTagModal
        ref={modalRef}
        onSuccess={table.reload}
        renderForm={renderTagForm}
      />
    </div>
  );
};

export default Tags;
