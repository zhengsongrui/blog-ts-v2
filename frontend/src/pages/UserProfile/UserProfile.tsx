/**
 * 用户个人中心页面
 * 可编辑个人资料并保存
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  message,
  Space,
  Typography,
  Divider,
  Spin,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  CameraOutlined,
  SaveOutlined,
  LockOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { User, UpdateUserDto } from '@/api/types';
import { userApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores/auth.store';
import { REGEX, USER_ROLE_LABEL, API_BASE_URL } from '@/config/constants';
import dayjs from 'dayjs';
import styles from './UserProfile.module.less';

const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
  const [form] = Form.useForm<UpdateUserDto & { confirmPassword?: string }>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [avatarFileList, setAvatarFileList] = useState<UploadFile[]>([]);
  const { user: storeUser, token } = useAuthStore();

  /**
   * 加载当前用户数据
   */
  const loadUserData = async () => {
    setLoading(true);
    try {
      // 优先从 API 获取最新数据
      const userData = await userApi.getCurrentUser();
      setUser(userData);
      // 更新表单数据
      form.setFieldsValue({
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar,
        bio: userData.bio || '',
      });
    } catch (error) {
      console.error('加载用户数据失败', error);
      // 如果 API 失败，尝试使用 store 中的用户数据
      if (storeUser) {
        setUser(storeUser);
        form.setFieldsValue({
          username: storeUser.username,
          email: storeUser.email,
          avatar: storeUser.avatar,
          bio: storeUser.bio || '',
        });
      } else {
        message.error('加载用户信息失败，请重新登录');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  /**
   * 处理头像上传变化
   */
  const handleAvatarChange: UploadProps['onChange'] = ({ fileList }) => {
    setAvatarFileList(fileList);
    if (fileList.length > 0 && fileList[0].status === 'done') {
      const avatarUrl = fileList[0].response?.data?.url || fileList[0].thumbUrl;
      form.setFieldValue('avatar', avatarUrl);
      // 立即更新用户头像到服务器
      userApi.updateCurrentUser({ avatar: avatarUrl })
        .then(updatedUser => {
          setUser(updatedUser);
          // 更新 store 中的用户信息
          useAuthStore.getState().login(updatedUser, token!);
          message.success('头像更新成功');
        })
        .catch(error => {
          const errorMessage = error?.response?.data?.error?.message || '头像更新失败';
          console.error('更新头像失败', error);
          message.error(errorMessage);
        });
    }
    if (fileList.length > 0 && fileList[0].status === 'error') {
      message.error('头像上传失败，请重试');
    }
  };

  /**
   * 处理保存个人资料
   */
  const handleSaveProfile = async (values: UpdateUserDto & { confirmPassword?: string }) => {
    // 如果密码字段有值，则验证确认密码
    if (values.password && values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    const updateData: UpdateUserDto = {
      username: values.username,
      email: values.email,
      bio: values.bio,
      avatar: values.avatar,
    };
    // 如果密码不为空，则包含密码
    if (values.password) {
      updateData.password = values.password;
    }

    setSaving(true);
    try {
      const updatedUser = await userApi.updateCurrentUser(updateData);
      setUser(updatedUser);
      // 更新 store 中的用户信息
      useAuthStore.getState().login(updatedUser, token!);
      message.success('个人资料更新成功');
      // 清空密码字段
      form.setFieldsValue({ password: '', confirmPassword: '' });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || '更新失败，请稍后重试';
      console.error('更新用户信息失败', error);
      message.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * 重置表单
   */
  const handleReset = () => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio || '',
        password: '',
        confirmPassword: '',
      });
      setAvatarFileList([]);
    }
  };

  if (loading) {
    return (
      <div className={styles['user-profile-page']}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" tip="加载用户信息中..." />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles['user-profile-page']}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Title level={4}>无法加载用户信息</Title>
            <Button type="primary" onClick={loadUserData}>
              重试
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles['user-profile-page']}>
      <div className={styles['profile-header']}>
        <Title level={2} className={styles['profile-title']}>
          个人中心
        </Title>
        <Text type="secondary" className={styles['profile-subtitle']}>
          管理您的个人资料和账户设置
        </Text>
      </div>

      <Card className={styles['profile-card']}>
        <div className={styles['card-header']}>
          <Title level={4} className={styles['card-title']}>
            基本信息
          </Title>
          <Text type="secondary">
            注册于 {dayjs(user.createdAt).format('YYYY-MM-DD HH:mm')} • 最后更新 {dayjs(user.updatedAt).format('YYYY-MM-DD HH:mm')}
          </Text>
        </div>

        <div className={styles['card-body']}>
          {/* 头像上传区域 */}
          <div className={styles['avatar-section']}>
            <div className={styles['avatar-wrapper']}>
              <Avatar
                src={user.avatar || undefined}
                icon={!user.avatar && <UserOutlined />}
                size={120}
                className={styles['avatar']}
              />
            </div>
            <div className={styles['avatar-upload']}>
              <Upload
                action={API_BASE_URL + '/upload'}
                listType="picture-circle"
                fileList={avatarFileList}
                onChange={handleAvatarChange}
                maxCount={1}
                showUploadList={false}
                headers={{
                  Authorization: token ? `Bearer ${token}` : '',
                }}
              >
                <Button icon={<CameraOutlined />}>更换头像</Button>
              </Upload>
              <div className={styles['upload-button']}>
                <Text type="secondary">支持 JPG、PNG 格式，大小不超过 2MB</Text>
              </div>
            </div>
          </div>

          <Divider />

          {/* 表单区域 */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveProfile}
            className={styles['form-section']}
            initialValues={{
              username: user.username,
              email: user.email,
              avatar: user.avatar,
              bio: user.bio || '',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* 用户名 */}
              <Form.Item
                label="用户名"
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { pattern: REGEX.USERNAME, message: '用户名格式无效（3-20位字母、数字、下划线或短横线）' },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
              </Form.Item>

              {/* 邮箱 */}
              <Form.Item
                label="邮箱地址"
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { pattern: REGEX.EMAIL, message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="请输入邮箱地址" />
              </Form.Item>
            </div>

            {/* 个人简介 */}
            <Form.Item label="个人简介" name="bio">
              <Input.TextArea rows={4} placeholder="介绍一下你自己..." maxLength={200} showCount />
            </Form.Item>

            {/* 只读信息 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <Text strong>用户角色</Text>
                <div className={styles['readonly-field']}>{USER_ROLE_LABEL[user.role] || user.role}</div>
              </div>
              <div>
                <Text strong>用户ID</Text>
                <div className={styles['readonly-field']}>{user.id}</div>
              </div>
            </div>

            <Divider />

            {/* 修改密码区域 */}
            <Title level={5} style={{ marginBottom: '16px' }}>
              修改密码（可选）
            </Title>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <Form.Item
                label="新密码"
                name="password"
                rules={[
                  { min: 6, message: '密码长度至少6位' },
                  { pattern: REGEX.PASSWORD, message: '密码需包含大小写字母和数字' },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="留空表示不修改密码" />
              </Form.Item>

              <Form.Item
                label="确认新密码"
                name="confirmPassword"
                rules={[
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
                <Input.Password prefix={<LockOutlined />} placeholder="再次输入新密码" />
              </Form.Item>
            </div>

            {/* 表单操作 */}
            <div className={styles['form-actions']}>
              <Button onClick={handleReset} disabled={saving}>
                重置
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                icon={<SaveOutlined />}
              >
                {saving ? '保存中...' : '保存更改'}
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;