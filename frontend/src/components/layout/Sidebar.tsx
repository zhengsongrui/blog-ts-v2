import { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  HomeOutlined,
  ReadOutlined,
  EditOutlined,
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  FolderOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTE_PATHS } from '@/config/constants';
import styles from './Sidebar.module.less';

const { Sider } = Layout;

/**
 * 侧边栏组件
 * @description 提供应用的主要导航菜单
 */
interface SidebarProps {
  /** 是否折叠 */
  collapsed?: boolean;
  /** 折叠状态变更回调 */
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onCollapse }) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['home']);
  const location = useLocation();
  const navigate = useNavigate();

  // 根据当前路径更新选中的菜单项
  const pathToKeyMap: Record<string, string> = {
    [ROUTE_PATHS.HOME]: 'home',
    [ROUTE_PATHS.POSTS]: 'posts',
    [ROUTE_PATHS.POST_CREATE]: 'create-post',
    [ROUTE_PATHS.USER_PROFILE]: 'profile',
    [ROUTE_PATHS.ADMIN]: 'admin',
    [ROUTE_PATHS.ADMIN_USERS]: 'admin-users',
    [ROUTE_PATHS.ADMIN_POSTS]: 'admin-posts',
  };

  // 监听路径变化
  useState(() => {
    const currentPath = location.pathname;
    const key = Object.entries(pathToKeyMap).find(([path]) =>
      currentPath.startsWith(path)
    )?.[1];
    if (key) {
      setSelectedKeys([key]);
    }
  });

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
      onClick: () => navigate(ROUTE_PATHS.HOME),
    },
    {
      key: 'posts',
      icon: <ReadOutlined />,
      label: '文章列表',
      onClick: () => navigate(ROUTE_PATHS.POSTS),
    },
    {
      key: 'create-post',
      icon: <EditOutlined />,
      label: '写文章',
      onClick: () => navigate(ROUTE_PATHS.POST_CREATE),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'management',
      icon: <DashboardOutlined />,
      label: '内容管理',
      children: [
        {
          key: 'categories',
          icon: <FolderOutlined />,
          label: '分类管理',
          onClick: () => navigate('/admin/categories'),
        },
        {
          key: 'tags',
          icon: <TagsOutlined />,
          label: '标签管理',
          onClick: () => navigate('/admin/tags'),
        },
      ],
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: '个人中心',
      children: [
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: '个人资料',
          onClick: () => navigate(ROUTE_PATHS.USER_PROFILE),
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: '账户设置',
          onClick: () => navigate('/settings'),
        },
      ],
    },
    {
      key: 'admin',
      icon: <DashboardOutlined />,
      label: '系统管理',
      children: [
        {
          key: 'admin-users',
          icon: <TeamOutlined />,
          label: '用户管理',
          onClick: () => navigate(ROUTE_PATHS.ADMIN_USERS),
        },
        {
          key: 'admin-posts',
          icon: <FileTextOutlined />,
          label: '文章管理',
          onClick: () => navigate(ROUTE_PATHS.ADMIN_POSTS),
        },
      ],
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
      breakpoint="lg"
      className={styles.sidebar}
      theme="light"
    >
      <div className={styles['sidebar-inner']}>
        {/* Logo 区域 */}
        <div className={styles['logo-area']}>
          <div className={styles['logo-container']}>
            <div className={styles['logo-box']}>
              <span className={styles['logo-letter']}>B</span>
            </div>
            {!collapsed && (
              <span className={styles['logo-text']}>
                博客后台
              </span>
            )}
          </div>
        </div>

        {/* 菜单区域 */}
        <div className={styles['menu-area']}>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            items={menuItems}
            className={styles.menu}
          />
        </div>

        {/* 底部区域 */}
        <div className={styles['bottom-area']}>
          {!collapsed && (
            <Button
              type="text"
              block
              icon={<SettingOutlined />}
              onClick={() => navigate('/settings')}
              className={styles['bottom-button']}
            >
              系统设置
            </Button>
          )}
          {collapsed && (
            <div className={styles['bottom-button-icon']}>
              <Button type="text" icon={<SettingOutlined />} />
            </div>
          )}
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;