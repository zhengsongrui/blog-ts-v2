/**
 * 文章管理页面
 * 管理员可以查看、创建、编辑、删除文章
 * 使用新的架构模式，参考分类管理页面
 */

import React, { useCallback, useRef } from "react";
import { renderPostColumns } from "./schema/tableColumns";
import { renderPostQueryFields } from "./schema/queryFields";
import QueryFilter from "@/components/QueryFilter";
import BaseTable from "@/components/BaseTable";
import useQueryFilter from "@/hooks/useQueryFilter";
import useTableRequest from "@/hooks/useTableRequest";
import EditPostModal from "@/components/FormModal";
import type { FormModalRef } from "@/components/FormModal/types";
import { renderPostForm } from "./schema/modalForms";
import { postApi } from "@/api/endpoints/post.api";
import type { ApiResponsePost } from "@/api/types/post.types";
import { Button } from "antd";

const Posts: React.FC = () => {
  const query = useQueryFilter({});

  /** * 表格请求 Hook
   */
  const table = useTableRequest({
    request: postApi.getPosts,
    params: query.getParams(),
  });
  const handleEdit = useCallback((record: ApiResponsePost) => {
    modalRef.current?.open({
      title: "编辑文章",
      record,
      api: (data) => postApi.updatePost(record.id, data),
    });
  }, []);

  const handleDelete = useCallback((record: ApiResponsePost) => {
    postApi.deletePost(record.id).then(() => {
      table.reload();
    });
  }, []);

  // modal表单相关
  const modalRef = useRef<FormModalRef>(null);
  return (
    <div>
      <QueryFilter
        fields={renderPostQueryFields({})}
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
                title: "新增文章",
                record: {},
                api: postApi.createPost,
              });
            }}
          >
            新增文章
          </Button>
        }
      />

      <BaseTable
        columns={renderPostColumns({
          EditAction: handleEdit,
          DeleteAction: handleDelete,
        })}
        dataSource={table.data}
        loading={table.loading}
        pagination={table.pagination}
      />
      <EditPostModal
        ref={modalRef}
        onSuccess={table.reload}
        renderForm={renderPostForm}
      />
    </div>
  );
};

export default Posts;