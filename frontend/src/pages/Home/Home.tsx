/**
 * 首页
 */

import React from 'react';
import { Button, Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTE_PATHS } from '@/config/constants';
import styles from './Home.module.less';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  /**
   * 跳转到文章列表
   */
  const handleGoToPosts = () => {
    navigate(ROUTE_PATHS.POSTS);
  };

  /**
   * 跳转到登录
   */
  const handleGoToLogin = () => {
    navigate(ROUTE_PATHS.LOGIN);
  };

  /**
   * 跳转到注册
   */
  const handleGoToRegister = () => {
    navigate(ROUTE_PATHS.REGISTER);
  };

  return (
    <div className={styles['home-page']}>
      <div className={styles['home-hero']}>
        <h1 className={styles['home-title']}>欢迎来到BLOG-V2</h1>
        <p className={styles['home-subtitle']}>
          分享你的想法、经验和知识
        </p>

        {isAuthenticated ? (
          <div className={styles['home-welcome']}>
            <p className={styles['home-welcome-text']}>
              欢迎回来，<strong>{user?.username}</strong>！
            </p>
            <Button type="primary" size="large" onClick={handleGoToPosts}>
              查看文章
            </Button>
          </div>
        ) : (
          <div className={styles['home-actions']}>
            <Button type="primary" size="large" onClick={handleGoToLogin}>
              登录
            </Button>
            <Button size="large" onClick={handleGoToRegister}>
              注册
            </Button>
          </div>
        )}
      </div>

      <div className={styles['home-features']}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <Card title="技术博客" bordered={false}>
              <p>分享编程技术、开发经验和最新技术趋势</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card title="生活记录" bordered={false}>
              <p>记录生活点滴、旅行见闻和个人思考</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card title="知识分享" bordered={false}>
              <p>分享学习心得、读书笔记和行业洞察</p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;