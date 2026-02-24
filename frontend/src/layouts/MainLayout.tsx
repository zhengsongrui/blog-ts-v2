import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import styles from './MainLayout.module.less';

const { Content } = Layout;

/**
 * 主布局组件
 * @description 提供应用的主要布局结构，包含头部、侧边栏、内容和底部
 */
const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <Layout className={styles.layout}>
        <Header
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <Layout className={styles.innerLayout}>
          <Sidebar
            collapsed={sidebarCollapsed}
            onCollapse={handleSidebarCollapse}
          />
          <Layout className={styles.contentWrapper}>
            <Content className={styles.content}>
              <Outlet />
            </Content>
            {/* <Footer /> */}
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;