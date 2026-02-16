/**
 * 分类管理页面
 * 管理员可以查看、创建、编辑、删除分类
 * 使用 useCategories Hook 管理数据，使用通用组件 MyTable 和 FormModal
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Space, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '@/api/types';
import { useCategories } from '@/hooks/useCategories';
import MyTable from '@/components/ui/MyTable';
import FormModal from '@/components/ui/FormModal';
import styles from './Categories.module.less';

const Categories: React.FC = () => {
  const {
    categories,
    loading,
    pagination,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    setCategories,
  } = useCategories();

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  // 初始加载数据
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setModalOpen(true);
  };

  const handleView = (category: Category) => {
    setViewingCategory(category);
    setViewModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    const success = await deleteCategory(category.id);
    if (success) {
      message.success('分类删除成功');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        // 更新分类
        const updated = await updateCategory(editingCategory.id, values as UpdateCategoryDto);
        if (updated) {
          message.success('分类更新成功');
        }
      } else {
        // 创建分类
        const created = await createCategory(values as CreateCategoryDto);
        if (created) {
          message.success('分类创建成功');
        }
      }
      setModalOpen(false);
      form.resetFields();
    } catch (error) {
      // 表单验证失败或 API 错误，已在相应位置提示
      console.error('表单提交失败:', error);
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setViewingCategory(null);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    fetchCategories({ page, pageSize });
  };

  // 表格列定义
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string | null) => text || '暂无描述',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: Category) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            title="查看"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="编辑"
          />
          <Popconfirm
            title="确定要删除这个分类吗？"
            description="删除后不可恢复，请谨慎操作。"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="删除"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles['categories-page']}>
      <Card
        bordered={false}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建分类
          </Button>
        }
      >
        <MyTable<Category>
          data={categories}
          columns={columns}
          loading={loading}
          showPagination={true}
          currentPage={pagination?.page || 1}
          pageSize={pagination?.pageSize || 10}
          total={pagination?.totalItems || 0}
          onPageChange={handlePageChange}
          rowKey="id"
        />
      </Card>

      {/* 创建/编辑分类模态框 */}
      <FormModal<CreateCategoryDto>
        title={editingCategory ? '编辑分类' : '新建分类'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        loading={loading}
        okText={editingCategory ? '保存' : '创建'}
        cancelText="取消"
        width={500}
        destroyOnClose
        autoCloseAfterSubmit={false}
        form={form}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="分类名称"
            name="name"
            rules={[
              { required: true, message: '请输入分类名称' },
              { max: 50, message: '名称不能超过50个字符' },
            ]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            label="Slug"
            name="slug"
            rules={[
              { required: true, message: '请输入分类Slug' },
              { pattern: /^[a-z0-9\-]+$/, message: 'Slug只能包含小写字母、数字和连字符' },
            ]}
          >
            <Input placeholder="例如: technology" />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            rules={[{ max: 200, message: '描述不能超过200个字符' }]}
          >
            <Input.TextArea
              placeholder="请输入分类描述（可选）"
              rows={3}
              showCount
              maxLength={200}
            />
          </Form.Item>
        </Form>
      </FormModal>

      {/* 查看分类详情模态框 */}
      <FormModal
        title="分类详情"
        open={viewModalOpen}
        onCancel={handleViewModalClose}
        footer={null}
        width={500}
      >
        {viewingCategory && (
          <div className={styles['category-detail']}>
            <div className={styles['field']}>
              <label>ID</label>
              <p>{viewingCategory.id}</p>
            </div>
            <div className={styles['field']}>
              <label>名称</label>
              <h3>{viewingCategory.name}</h3>
            </div>
            <div className={styles['field']}>
              <label>Slug</label>
              <p>{viewingCategory.slug}</p>
            </div>
            <div className={styles['field']}>
              <label>描述</label>
              <p>{viewingCategory.description || '暂无描述'}</p>
            </div>
            <div className={styles['field']}>
              <label>创建时间</label>
              <p>{new Date(viewingCategory.createdAt).toLocaleString()}</p>
            </div>
            <div className={styles['field']}>
              <label>更新时间</label>
              <p>{new Date(viewingCategory.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </FormModal>
    </div>
  );
};

export default Categories;