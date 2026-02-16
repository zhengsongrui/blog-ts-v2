/**
 * 注册页面
 */

import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import type { CreateUserDto } from '@/api/types';
import { ROUTE_PATHS, REGEX } from '@/config/constants';
import styles from './Register.module.less';

// 注册表单值类型（包含确认密码字段）
type RegisterFormValues = CreateUserDto & {
  confirmPassword: string;
};

const Register: React.FC = () => {
  const [form] = Form.useForm<RegisterFormValues>();
  const navigate = useNavigate();
  const { register, isRegistering } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);

  /**
   * 处理表单提交
   */
  const handleSubmit = async (values: RegisterFormValues) => {
    // 确认密码验证
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    // 提取 CreateUserDto 字段
    const { confirmPassword, ...registerData } = values;
    const result = await register(registerData);
    if (result.success) {
      // message.success('注册成功');
      // 注册成功后跳转到登录页，由 useAuth 内部处理
    }
  };

  /**
   * 跳转到登录页
   */
  const handleGoToLogin = () => {
    navigate(ROUTE_PATHS.LOGIN);
  };

  return (
    <div className={styles['register-page']}>
      <div className={styles['register-header']}>
        {/* <h2 className={styles['register-title']}>注册新账户</h2> */}
        <p className={styles['register-subtitle']}>创建您的个人博客账户</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark="optional"
        onFinish={handleSubmit}
        className={styles['register-form']}
      >
        {/* 用户名输入 */}
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            { pattern: REGEX.USERNAME, message: '用户名只能包含字母、数字、下划线和连字符，长度3-20位' },
          ]}
        >
          <Input
            prefix={<UserOutlined className={styles['form-icon']} />}
            placeholder="请输入用户名"
            size="large"
            autoComplete="username"
          />
        </Form.Item>

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
            { pattern: REGEX.PASSWORD, message: '密码必须包含大小写字母和数字' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className={styles['form-icon']} />}
            placeholder="请输入密码"
            size="large"
            autoComplete="new-password"
            visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
          />
        </Form.Item>

        {/* 确认密码 */}
        <Form.Item
          label="确认密码"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className={styles['form-icon']} />}
            placeholder="请再次输入密码"
            size="large"
            autoComplete="new-password"
          />
        </Form.Item>

        {/* 提交按钮 */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isRegistering}
            block
            className={styles['register-button']}
          >
            {isRegistering ? '注册中...' : '注册'}
          </Button>
        </Form.Item>

        {/* 登录引导 */}
        <div className={styles['register-footer']}>
          <span className={styles['login-text']}>已有账户？</span>
          <Button type="link" onClick={handleGoToLogin} className={styles['login-link']}>
            立即登录
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Register;