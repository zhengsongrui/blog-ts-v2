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
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/api/types/common.types';
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
  const { user, isAuthenticated } = useAuthStore();
  const role = user?.role;
  
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
    { path: ROUTE_PATHS.ADMIN_POSTS_MANAGEMENT, key: 'admin-posts', exact: true },
    { path: ROUTE_PATHS.ADMIN_CATEGORIES_MANAGEMENT, key: 'categories', exact: true },
    { path:  ROUTE_PATHS.ADMIN_TAGS_MANAGEMENT, key: 'tags', exact: true },
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

  const menuItems = useMemo(() => {
    const items: any[] = [];

    // 首页 - 所有人可见
    items.push({
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
      onClick: () => navigate(ROUTE_PATHS.HOME),
    });

    // 文章 - 所有人可见
    items.push({
      key: 'posts',
      icon: <ReadOutlined />,
      label: '文章',
      onClick: () => navigate(ROUTE_PATHS.POSTS),
    });

    // 写文章 - 仅登录用户可见
    if (isAuthenticated) {
      items.push({
        key: 'create-post',
        icon: <EditOutlined />,
        label: '写文章',
        onClick: () => navigate(ROUTE_PATHS.POST_CREATE),
      });
      // 在写文章后添加分隔线
      items.push({ type: 'divider' as const });
    }

    // 内容管理 - 仅管理员和编辑可见
    if (role === UserRole.ADMIN || role === UserRole.EDITOR) {
      items.push({
        key: 'content-management',
        icon: <DashboardOutlined />,
        label: '内容管理',
        children: [
          {
            key: 'admin-posts',
            icon: <FileTextOutlined />,
            label: '文章管理',
            onClick: () => navigate(ROUTE_PATHS.ADMIN_POSTS_MANAGEMENT),
          },
          {
            key: 'categories',
            icon: <FolderOutlined />,
            label: '分类管理',
            onClick: () => navigate(ROUTE_PATHS.ADMIN_CATEGORIES_MANAGEMENT),
          },
          {
            key: 'tags',
            icon: <TagsOutlined />,
            label: '标签管理',
            onClick: () => navigate(ROUTE_PATHS.ADMIN_TAGS_MANAGEMENT),
          },
        ],
      });
    }

    // 个人中心 - 仅登录用户可见
    if (isAuthenticated) {
      items.push({
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
        ],
      });
    }

    // 系统管理 - 仅管理员可见
    if (role === UserRole.ADMIN) {
      items.push({
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
      });
    }

    return items;
  }, [navigate, isAuthenticated, role]);

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