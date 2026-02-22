/**
 * 写文章页面
 * 使用 @uiw/react-md-editor 实现 Markdown 编辑器和预览
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Form, Input, Select, Switch, message } from "antd";
import { postApi } from "@/api/endpoints/post.api";
import { categoryApi } from "@/api/endpoints/category.api";
import { tagApi } from "@/api/endpoints/tag.api";
import { POST_STATUS, POST_STATUS_LABEL } from "@/config/constants";
import { PostStatus } from "@/api/types/common.types";
import type {
  CreatePostDto,
  UpdatePostDto,
  Post,
} from "@/api/types/post.types";
import type { Category } from "@/api/types/category.types";
import type { Tag } from "@/api/types/tag.types";
import Editor from "@uiw/react-md-editor";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "@/styles/markdown-editor.less";

const { Option } = Select;

interface PostFormData extends CreatePostDto {
  id?: string;
}

const PostEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<PostFormData>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 文章状态选项
  const postStatusOptions = [
    { value: POST_STATUS.DRAFT, label: POST_STATUS_LABEL[POST_STATUS.DRAFT] },
    {
      value: POST_STATUS.PUBLISHED,
      label: POST_STATUS_LABEL[POST_STATUS.PUBLISHED],
    },
    {
      value: POST_STATUS.ARCHIVED,
      label: POST_STATUS_LABEL[POST_STATUS.ARCHIVED],
    },
  ];

  // 加载分类和标签数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoryResponse, tagResponse] = await Promise.all([
          categoryApi.getCategories(),
          tagApi.getTags(),
        ]);

        setCategories(categoryResponse.data);
        setTags(tagResponse.data);
      } catch (error) {
        message.error("加载分类和标签失败");
      }
    };

    loadData();
  }, []);

  // 如果是编辑模式，加载文章数据
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const loadPost = async () => {
        try {
          const response = await postApi.getPostById(id);
          const postData = response;

          form.setFieldsValue({
            ...postData,
            categoryIds: postData.categories?.map((c) => c.id) || [],
            tagIds: postData.tags?.map((t) => t.id) || [],
          });
        } catch (error) {
          message.error("加载文章失败");
          navigate("/admin/postsManagement");
        }
      };

      loadPost();
    }
  }, [id, form, navigate]);

  const handleSubmit = async (values: PostFormData) => {
    setLoading(true);

    try {
      if (isEditing) {
        // 编辑文章
        const updateData: UpdatePostDto = {
          title: values.title,
          content: values.content,
          excerpt: values.excerpt || null,
          featuredImage: values.featuredImage || null,
          status: values.status,
          categoryIds: values.categoryIds || [],
          tagIds: values.tagIds || [],
        };

        await postApi.updatePost(id!, updateData);
        message.success("文章更新成功");
      } else {
        // 创建文章
        const createData: CreatePostDto = {
          title: values.title,
          content: values.content,
          excerpt: values.excerpt || null,
          featuredImage: values.featuredImage || null,
          status: values.status || PostStatus.DRAFT,
          categoryIds: values.categoryIds || [],
          tagIds: values.tagIds || [],
        };

        await postApi.createPost(createData);
        message.success("文章创建成功");
      }

      navigate("/admin/postsManagement");
    } catch (error) {
      message.error(isEditing ? "更新文章失败" : "创建文章失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-editor">
      <Card title={isEditing ? "编辑文章" : "新建文章"} bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: PostStatus.DRAFT,
          }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="请输入文章标题" />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="摘要"
            rules={[{ max: 200, message: "摘要不能超过200个字符" }]}
          >
            <Input.TextArea placeholder="请输入文章摘要" rows={3} />
          </Form.Item>

          <Form.Item
            name="featuredImage"
            label="特色图片"
            rules={[
              { pattern: /^https?:\/\/.+$/, message: "请输入有效的图片URL" },
            ]}
          >
            <Input placeholder="请输入特色图片URL" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: "请选择文章状态" }]}
          >
            <Select placeholder="请选择文章状态">
              {postStatusOptions.map((status) => (
                <Option key={status.value} value={status.value}>
                  {status.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="categoryIds" label="分类">
            <Select mode="multiple" placeholder="请选择分类" allowClear>
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="tagIds" label="标签">
            <Select mode="multiple" placeholder="请选择标签" allowClear>
              {tags.map((tag) => (
                <Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: "请输入文章内容" }]}
          >
              <Editor
                height={500}
                value={form.getFieldValue("content")}
                onChange={(value) => form.setFieldsValue({ content: value })}
                preview="edit"
              />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? "更新文章" : "创建文章"}
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate("/admin/postsManagement")}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PostEditor;
