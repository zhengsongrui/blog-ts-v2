/**
 * 登录页面
 */

import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import type { LoginDto } from '@/api/types';
import { ROUTE_PATHS, REGEX } from '@/config/constants';
import styles from './Login.module.less';

const STORAGE_KEY = 'remembered_email';

const Login: React.FC = () => {
  const [form] = Form.useForm<LoginDto & { remember?: boolean }>();
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();

  // 组件挂载时，从本地存储读取记住的邮箱并填充
  useEffect(() => {
    const savedEmail = localStorage.getItem(STORAGE_KEY);
    if (savedEmail) {
      form.setFieldsValue({ email: savedEmail, remember: true });
    }
  }, [form]);

  /**
   * 处理表单提交
   */
  const handleSubmit = async (values: LoginDto & { remember?: boolean }) => {
    const { remember, ...loginData } = values;
    const result = await login(loginData);
    if (result.success) {
      // 登录成功后，根据 remember 标志保存或清除邮箱
      if (remember) {
        localStorage.setItem(STORAGE_KEY, loginData.email);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      message.success('登录成功');
      // 登录成功后跳转到首页，由 useAuth 内部处理
    }
  };

  /**
   * 跳转到注册页
   */
  const handleGoToRegister = () => {
    navigate(ROUTE_PATHS.REGISTER);
  };

  return (
    <div className={styles['login-page']}>
    <div className={styles['login-header']}>
      {/* <h2 className={styles['login-title']}>登录</h2> */}
      <p className={styles['login-subtitle']}>欢迎回来，请登录您的账户</p>
    </div>

    <Form
      form={form}
      layout="vertical"
      requiredMark="optional"
      onFinish={handleSubmit}
      className={styles['login-form']}
      initialValues={{ remember: false }}
    >
      {/* 邮箱输入 */}
      <Form.Item
        label="邮箱地址"
        name="email"
        rules={[
          { required: true, message: '请输入邮箱地址' },
          { pattern: REGEX.EMAIL, message: '请输入有效的邮箱地址' },
        ]}
      >
        <Input
          prefix={<MailOutlined className={styles['form-icon']} />}
          placeholder="请输入邮箱地址"
          size="large"
          autoComplete="email"
        />
      </Form.Item>

      {/* 密码输入 */}
      <Form.Item
        label="密码"
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码长度至少6位' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className={styles['form-icon']} />}
          placeholder="请输入密码"
          size="large"
          autoComplete="current-password"
        />
      </Form.Item>

      {/* 记住我 & 忘记密码 */}
      <div className={styles['login-options']}>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>记住我</Checkbox>
        </Form.Item>
        <Link to="/forgot-password" className={styles['forgot-password-link']}>
          忘记密码？
        </Link>
      </div>

      {/* 提交按钮 */}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={isLoggingIn}
          block
          className={styles['login-button']}
        >
          {isLoggingIn ? '登录中...' : '登录'}
        </Button>
      </Form.Item>

      {/* 分割线 */}
      <Divider plain>或</Divider>

      {/* 注册引导 */}
      <div className={styles['login-footer']}>
        <span className={styles['register-text']}>还没有账户？</span>
        <Button type="link" onClick={handleGoToRegister} className={styles['register-link']}>
          立即注册
        </Button>
      </div>
    </Form>
    </div>
  );
};

export default Login;