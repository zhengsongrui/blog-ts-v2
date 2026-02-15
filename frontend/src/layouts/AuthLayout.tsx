import { Outlet } from 'react-router-dom';
import { Layout, Card, ConfigProvider, theme } from 'antd';
import { APP_NAME } from '@/config/constants';
import styles from './AuthLayout.module.less';

const { Content } = Layout;

/**
 * 认证页面布局组件
 * @description 用于登录、注册等认证相关页面的简约布局
 */
const AuthLayout: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
        },
      }}
    >
      <Layout className={styles['auth-layout']}>
        <Content className={styles['auth-content']}>
          <div className={styles['auth-container']}>
            <div className={styles['auth-header']}>
              <div className={styles['auth-logo']}>
                <span className={styles['auth-logo-text']}>B</span>
              </div>
              <h1 className={styles['auth-title']}>{APP_NAME}</h1>
            </div>

              <Outlet />

            <div className={styles['auth-footer']}>
              <p>
                使用即表示您同意我们的{' '}
                <a href="/terms" className={styles['auth-link']}>
                  服务条款
                </a>{' '}
                和{' '}
                <a href="/privacy" className={styles['auth-link']}>
                  隐私政策
                </a>
              </p>
            </div>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default AuthLayout;