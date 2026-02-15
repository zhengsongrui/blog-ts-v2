/**
 * 应用根组件
 */

import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import { router } from '@/config/router';
import { useAuthStore } from '@/stores/auth.store';
import '@/styles/globals.less';

function App() {
  // 初始化认证状态（可选）
  const { isAuthenticated } = useAuthStore();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <AntdApp>
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;