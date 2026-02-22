import { Form, Input, Select, Switch } from "antd";
import { useState, useEffect } from "react";
import type { Post } from "@/api/types";
import { POST_STATUS } from "@/config/constants";
import { categoryApi } from "@/api/endpoints/category.api";
import { tagApi } from "@/api/endpoints/tag.api";

export const renderPostForm = (record?: Post) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取分类列表
  useEffect(() => {
    setLoading(true);
    categoryApi.getCategories()
      .then(res => {
        if (res.success) {
          setCategories(res.data.map(c => ({ label: c.name, value: c.id })));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // 获取标签列表
  useEffect(() => {
    setLoading(true);
    tagApi.getTags()
      .then(res => {
        if (res.success) {
          setTags(res.data.map(t => ({ label: t.name, value: t.id })));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Form.Item
        label="文章标题"
        name="title"
        rules={[{ required: true, message: "请输入文章标题" }, { max: 200, message: "标题不能超过200个字符" }]}
      >
        <Input placeholder="请输入文章标题" />
      </Form.Item>

      <Form.Item
        label="文章内容"
        name="content"
        rules={[{ required: true, message: "请输入文章内容" }]}
      >
        <Input.TextArea placeholder="请输入文章内容" rows={8} />
      </Form.Item>

      <Form.Item
        label="摘要"
        name="excerpt"
        rules={[{ max: 500, message: "摘要不能超过500个字符" }]}
      >
        <Input.TextArea placeholder="请输入文章摘要" rows={3} />
      </Form.Item>

      <Form.Item
        label="特色图片"
        name="featuredImage"
        rules={[{ max: 500, message: "图片URL不能超过500个字符" }]}
      >
        <Input placeholder="请输入特色图片URL" />
      </Form.Item>

      <Form.Item
        label="文章状态"
        name="status"
        initialValue={POST_STATUS.DRAFT}
      >
        <Select placeholder="请选择文章状态">
          <Select.Option value={POST_STATUS.DRAFT}>草稿</Select.Option>
          <Select.Option value={POST_STATUS.PUBLISHED}>已发布</Select.Option>
          <Select.Option value={POST_STATUS.ARCHIVED}>已归档</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="分类"
        name="categoryIds"
        rules={[{ required: true, message: "请选择至少一个分类" }]}
      >
        <Select
          mode="multiple"
          placeholder="请选择分类"
          options={categories}
          loading={loading}
        />
      </Form.Item>

      <Form.Item
        label="标签"
        name="tagIds"
        rules={[{ required: true, message: "请选择至少一个标签" }]}
      >
        <Select
          mode="multiple"
          placeholder="请选择标签"
          options={tags}
          loading={loading}
        />
      </Form.Item>
    </>
  );
};