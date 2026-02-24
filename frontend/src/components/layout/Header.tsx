import { useState } from 'react';
import { Layout, Button, Space, Avatar, Dropdown, theme } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { APP_NAME } from '@/config/constants';
import { useAuthStore } from '@/stores/auth.store';
import styles from './Header.module.less';

const { Header: AntHeader } = Layout;

/**
 * 应用头部组件
 * @description 包含 logo、导航菜单、用户操作等功能
 */
interface HeaderProps {
  /** 侧边栏是否折叠 */
  collapsed?: boolean;
  /** 切换侧边栏折叠状态的函数 */
  onToggleCollapsed?: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed = false, onToggleCollapsed }) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile'),
    },
    // {
    //   key: 'settings',
    //   icon: <SettingOutlined />,
    //   label: '设置',
    //   onClick: () => navigate('/settings'),
    // },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className={styles.header}>
      <div className={styles['header-left']}>
        {onToggleCollapsed && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggleCollapsed}
            className={styles['toggle-button']}
          />
        )}
        <div className={styles['logo-area']} onClick={() => navigate('/')}>
          <div className={styles['logo-box']}>
            <span className={styles['logo-letter']}>B</span>
          </div>
          <h1 className={styles['app-name']}>
            {APP_NAME}
          </h1>
        </div>
      </div>

      <div className={styles['header-right']}>
        <Space>
          <Button type="text" onClick={toggleTheme} className={styles['theme-toggle']}>
            {themeMode === 'light' ? '🌙' : '☀️'}
          </Button>

          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className={styles['user-dropdown']}>
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  src={user.avatar}
                  className={styles['user-avatar']}
                />
                <span className={styles.username}>
                  {user.username}
                </span>
              </div>
            </Dropdown>
          ) : (
            <Space className={styles['auth-buttons']}>
              <Button type="text" onClick={() => navigate('/login')}>
                登录
              </Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                注册
              </Button>
            </Space>
          )}
        </Space>
      </div>
    </AntHeader>
  );
};

export default Header;