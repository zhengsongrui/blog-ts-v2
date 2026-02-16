import { useState, useEffect, useMemo } from 'react';
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
  const pathToKeyMap: Array<{ path: string; key: string; exact?: boolean }> = [
    // 精确匹配的路径
    { path: ROUTE_PATHS.HOME, key: 'home', exact: true },
    { path: ROUTE_PATHS.POSTS, key: 'posts', exact: true },
    { path: ROUTE_PATHS.POST_DETAIL, key: 'posts', exact: false },
    { path: ROUTE_PATHS.POST_EDIT, key: 'posts', exact: false },
    { path: ROUTE_PATHS.POST_CREATE, key: 'create-post', exact: true },
    { path: ROUTE_PATHS.USER_PROFILE, key: 'profile', exact: true },
    { path: ROUTE_PATHS.ADMIN, key: 'system', exact: true },
    { path: ROUTE_PATHS.ADMIN_USERS, key: 'admin-users', exact: true },
    { path: ROUTE_PATHS.ADMIN_POSTS, key: 'admin-posts', exact: true },
    { path: '/admin/categories', key: 'categories', exact: true },
    { path: '/admin/tags', key: 'tags', exact: true },
    { path: '/settings', key: 'settings', exact: true },
  ];

  // 监听路径变化
  useEffect(() => {
    const currentPath = location.pathname;
    let matchedKey: string | null = null;

    // 优先匹配 exact: true 的路径
    for (const { path, key, exact } of pathToKeyMap) {
      if (exact) {
        if (currentPath === path) {
          matchedKey = key;
          break;
        }
      } else {
        if (currentPath.startsWith(path)) {
          matchedKey = key;
          break;
        }
      }
    }

    console.log('路径变化:', currentPath, '匹配的key:', matchedKey);
    if (matchedKey) {
      setSelectedKeys([matchedKey]);
    } else {
      // 如果没有匹配的路径，清空选中状态
      setSelectedKeys([]);
    }
  }, [location.pathname]);

  // 调试 selectedKeys 变化
  useEffect(() => {
    console.log('selectedKeys 更新:', selectedKeys);
  }, [selectedKeys]);

  // 处理菜单点击
  const handleMenuClick = (key: string) => {
    setSelectedKeys([key]);
  };

  const menuItems = useMemo(() => [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
      onClick: () => navigate(ROUTE_PATHS.HOME),
    },
    {
      key: 'posts',
      icon: <ReadOutlined />,
      label: '文章',
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
      key: 'content-management',
      icon: <DashboardOutlined />,
      label: '内容管理',
      children: [
        {
          key: 'admin-posts',
          icon: <FileTextOutlined />,
          label: '文章管理',
          onClick: () => navigate(ROUTE_PATHS.ADMIN_POSTS),
        },
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
          label: '设置',
          onClick: () => navigate('/settings'),
        },
      ],
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        {
          key: 'admin-users',
          icon: <TeamOutlined />,
          label: '用户管理',
          onClick: () => navigate(ROUTE_PATHS.ADMIN_USERS),
        },
      ],
    },
  ], [navigate]);

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
        {/* <div className={styles['logo-area']}>
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
        </div> */}

        {/* 菜单区域 */}
        <div className={styles['menu-area']}>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            items={menuItems}
            className={styles.menu}
            onClick={({ key }) => {
              setSelectedKeys([key]);
            }}
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
              设置
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