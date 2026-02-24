/**
 * 文章详情页面
 * 用于渲染单篇文章的完整内容，支持 Markdown 渲染和语法高亮
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import useRequest from '@/hooks/useRequest';
import { postApi } from '@/api/endpoints/post.api';
import type { Post } from '@/api/types';
import { Spin, Alert, Typography, Tag, Image, Space, Divider } from 'antd';
import { CalendarOutlined, EyeOutlined, UserOutlined, TagOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'highlight.js/styles/github.css'; // 代码高亮主题
import styles from './PostDetail.module.less'; // 样式文件

const { Title, Text, Paragraph } = Typography;

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // 获取文章详情
  const { data: post, loading, fetchData } = useRequest<string, Post>({
    request: postApi.getPostById,
    params: id!,
    manual: true, // 手动触发，通过 useEffect 控制
  });

  // 如果 id 发生变化，重新获取数据
  React.useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  // 加载状态
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin tip="正在加载文章..." size="large" />
      </div>
    );
  }

  // 错误状态（post 为空且不在加载中）
  if (!post) {
    return (
      <div className={styles.errorContainer}>
        <Alert
          message="文章加载失败"
          description="未能找到指定的文章，可能已被删除或链接无效。"
          type="error"
          showIcon
          action={
            <a href="/">返回首页</a>
          }
        />
      </div>
    );
  }

  // 兼容字段名差异
  const coverImage = post.coverImage ;
  const viewCount = post.viewCount ;

  // 格式化日期
  const formattedDate = post.publishedAt
    ? dayjs(post.publishedAt).format('YYYY年MM月DD日 HH:mm')
    : '未发布';

  return (
    <div className={styles.container}>
      {/* 文章头部信息 */}
      <header className={styles.header}>
        {/* 封面图 */}
        {coverImage && (
          <div className={styles.coverImage}>
            <Image
              src={coverImage}
              alt={post.title}
              width="100%"
              height={400}
              style={{ objectFit: 'cover', borderRadius: 8 }}
              preview={false}
            />
          </div>
        )}

        {/* 标题 */}
        <Title level={1} className={styles.title}>
          {post.title}
        </Title>

        {/* 摘要 */}
        {post.excerpt && (
          <Paragraph className={styles.excerpt}>
            {post.excerpt}
          </Paragraph>
        )}

        {/* 元数据 */}
        <Space className={styles.meta} split={<Divider type="vertical" />}>
          <span className={styles.metaItem}>
            <UserOutlined />
            <Text>{post.author?.username || '未知作者'}</Text>
          </span>
          <span className={styles.metaItem}>
            <CalendarOutlined />
            <Text>{formattedDate}</Text>
          </span>
          <span className={styles.metaItem}>
            <EyeOutlined />
            <Text>{viewCount} 次阅读</Text>
          </span>
        </Space>

        {/* 分类和标签 */}
        <div className={styles.taxonomies}>
          {post.categories.length > 0 && (
            <div className={styles.categories}>
              <TagOutlined style={{ marginRight: 4 }} />
              {post.categories.map((cat) => (
                <Tag key={cat.id} color="blue">
                  {cat.name}
                </Tag>
              ))}
            </div>
          )}
          {post.tags.length > 0 && (
            <div className={styles.tags}>
              <TagOutlined style={{ marginRight: 4 }} />
              {post.tags.map((tag) => (
                <Tag key={tag.id} color="green">
                  {tag.name}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </header>

      <Divider />

      {/* 文章内容 */}
      <article className={styles.content}>
        <div className={styles.markdownBody}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* 文章底部信息 */}
      <footer className={styles.footer}>
        <Paragraph type="secondary">
          本文最后更新于 {dayjs(post.updatedAt).format('YYYY年MM月DD日 HH:mm')}
          {post.status === 'DRAFT' && (
            <Tag color="orange" style={{ marginLeft: 8 }}>草稿</Tag>
          )}
        </Paragraph>
      </footer>
    </div>
  );
};

export default PostDetail;