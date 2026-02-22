import { createBrowserRouter } from 'react-router-dom';
import { routes } from './routes.tsx';

/**
 * 应用路由配置
 * @description 使用 React Router v6 创建的路由器实例
 */
export const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});