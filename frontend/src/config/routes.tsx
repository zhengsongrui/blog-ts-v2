import type { RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ROUTE_PATHS } from './constants';
import Loading from '@/components/common/Loading';
import Tags from '@/pages/Admin/Tags/Tags';

// 懒加载页面组件
const Home = lazy(() => import('@/pages/Home/Home'));
const Login = lazy(() => import('@/pages/Login/Login'));
const Register = lazy(() => import('@/pages/Register/Register'));
const Posts = lazy(() => import('@/pages/Posts/Posts'));
const PostDetail = lazy(() => import('@/pages/PostDetail/PostDetail'));
const Categories = lazy(() => import('@/pages/Admin/Categories/Categories'));

// 布局组件
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));

// 占位符组件（用于未实现的页面）
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p>此页面正在开发中...</p>
  </div>
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Loading />
  </div>
);

export const routes: RouteObject[] = [
  {
    path: ROUTE_PATHS.HOME,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: ROUTE_PATHS.POSTS,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Posts />
          </Suspense>
        ),
      },
      {
        path: ROUTE_PATHS.POST_DETAIL,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PostDetail />
          </Suspense>
        ),
      },
     
    
    ],
  },
  {
    path: ROUTE_PATHS.LOGIN,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: ROUTE_PATHS.REGISTER,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Register />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: ROUTE_PATHS.ADMIN,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        path: ROUTE_PATHS.ADMIN_CATEGORIES,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Categories />
          </Suspense>
        ),
      },
      {
        path: ROUTE_PATHS.ADMIN_TAGS,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Tags />
          </Suspense>
        ),
      },
    ],
  },
];