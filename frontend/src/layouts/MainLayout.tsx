import { Outlet } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';

const { Content } = Layout;

/**
 * 主布局组件
 * @description 提供应用的主要布局结构，包含头部、侧边栏、内容和底部
 */
const MainLayout: React.FC = () => {
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
      <Layout className="min-h-screen">
        <Header />
        <Layout>
          <Sidebar />
          <Layout className="p-4 md:p-6">
            <Content className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
              <Outlet />
            </Content>
            <Footer />
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;