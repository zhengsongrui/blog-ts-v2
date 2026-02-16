/**
 * 通用表单模态框组件
 * 基于 Ant Design Modal 封装，提供统一的表单提交、取消功能
 */

import React from 'react';
import { Modal, Form, type FormInstance, type FormProps } from 'antd';
import type { ModalProps } from 'antd/es/modal';
import styles from './FormModal.module.less';

interface FormModalProps<T = any> {
  /** 模态框标题 */
  title?: string;
  /** 是否可见 */
  open: boolean;
  /** 表单数据（编辑时传入） */
  initialValues?: Partial<T>;
  /** 表单字段配置（使用 Form.Item 子元素） */
  children?: React.ReactNode;
  /** 表单布局配置 */
  formProps?: Omit<FormProps, 'form' | 'initialValues'>;
  /** 加载状态 */
  loading?: boolean;
  /** 确认按钮文本 */
  okText?: string;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 点击确认回调（返回表单值） */
  onOk?: (values: T) => void | Promise<void>;
  /** 点击取消回调 */
  onCancel?: () => void;
  /** 自定义底部按钮 */
  footer?: React.ReactNode;
  /** 模态框宽度 */
  width?: number | string;
  /** 是否显示取消按钮 */
  showCancel?: boolean;
  /** 是否在关闭时销毁表单 */
  destroyOnClose?: boolean;
  /** 是否在提交后自动关闭 */
  autoCloseAfterSubmit?: boolean;
  /** 自定义表单实例（外部控制） */
  form?: FormInstance<T>;
}

function FormModal<T = any>(props: FormModalProps<T>) {
  const {
    title = '表单',
    open,
    initialValues,
    children,
    formProps,
    loading = false,
    okText = '确定',
    cancelText = '取消',
    onOk,
    onCancel,
    footer,
    width = 520,
    showCancel = true,
    destroyOnClose = true,
    autoCloseAfterSubmit = true,
    form: externalForm,
  } = props;

  const [internalForm] = Form.useForm<T>();
  const form = externalForm || internalForm;

  // 初始化表单值
  React.useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues as any);
    } else if (open) {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (onOk) {
        const result = onOk(values as T);
        if (result instanceof Promise) {
          await result;
        }
        if (autoCloseAfterSubmit && onCancel) {
          onCancel();
        }
        // 不清空表单，由外部控制
      }
    } catch (error) {
      // 表单验证失败，不关闭
      console.warn('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const defaultFooter = [
    showCancel && (
      <button key="cancel" className={styles['cancel-btn']} onClick={handleCancel} disabled={loading}>
        {cancelText}
      </button>
    ),
    <button key="submit" className={styles['submit-btn']} onClick={handleOk} disabled={loading}>
      {loading ? '提交中...' : okText}
    </button>,
  ];

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleCancel}
      footer={footer || defaultFooter}
      width={width}
      destroyOnClose={destroyOnClose}
      maskClosable={false}
      className={styles['form-modal']}
    >
      <Form form={form} layout="vertical" {...formProps}>
        {children}
      </Form>
    </Modal>
  );
}

export default FormModal;