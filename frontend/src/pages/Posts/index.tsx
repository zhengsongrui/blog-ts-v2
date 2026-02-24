/**
 * 文章列表页面（公开）
 * 未登录用户可以查看文章列表，支持按分类/标签/作者/标题查询
 */

import React, { useEffect, useState, useCallback } from "react";
import { renderPostListQueryFields } from "./schema/queryFields";
import QueryFilter from "@/components/QueryFilter";
import useQueryFilter from "@/hooks/useQueryFilter";
import useTableRequest from "@/hooks/useTableRequest";
import { postApi } from "@/api/endpoints/post.api";
import { categoryApi } from "@/api/endpoints/category.api";
import { tagApi } from "@/api/endpoints/tag.api";
import { userApi } from "@/api/endpoints/user.api";
import type { CategoryOption, TagOption, AuthorOption } from "./schema/queryFields";
import type { Post, Category } from "@/api/types";
import { POST_STATUS } from "@/config/constants";
import styles from "./schema/postsList.module.less";
import { Spin, Alert, Card, Row, Col, Pagination, Image, Tag, Empty } from "antd";
import { Link } from "react-router-dom";

const Posts: React.FC = () => {
  // 固定参数：默认只显示已发布的文章
  const fixedParams = { status: POST_STATUS.PUBLISHED };

  // 查询过滤器
  const query = useQueryFilter({}, fixedParams);

  // 表格请求
  const table = useTableRequest({
    request: postApi.getPosts,
    params: query.getParams(),
  });

  // 分类、标签、作者选项
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [tags, setTags] = useState<TagOption[]>([]);
  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取选项数据
  const fetchOptions = useCallback(async () => {
    setLoadingOptions(true);
    try {
      // 并行获取分类、标签、用户
      const [categoriesRes, tagsRes, usersRes] = await Promise.all([
        categoryApi.getAllCategories(),
        tagApi.getAllTags(),
        userApi.getAuthors(), // 获取作者列表（公开）
      ]);

      // 转换分类
      const categoryOptions: CategoryOption[] = Array.isArray(categoriesRes)
        ? categoriesRes.map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
          }))
        : [];
      setCategories(categoryOptions);

      // 转换标签
      const tagOptions: TagOption[] = Array.isArray(tagsRes)
        ? tagsRes.map((tag) => ({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
          }))
        : [];
      setTags(tagOptions);

      setAuthors(usersRes);

      setError(null);
    } catch (err) {
      console.error("Failed to fetch options:", err);
      setError("加载筛选选项失败，请刷新页面重试");
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // 查询字段
  const queryFields = renderPostListQueryFields({ categories, tags, authors });


  // 处理查询
  const handleSearch = () => {
    table.reload(query.getParams());
  };

  // 处理重置
  const handleReset = () => {
    query.reset();
    table.reload(query.getParams());
  };

  return (
    <div className={styles['container']}>
      <h1>文章列表</h1>
      <p className={styles['subtitle']}>浏览所有已发布的文章，支持多种筛选条件</p>

      {error && (
        <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} />
      )}

      <div className={styles['filter-container']}>
        {loadingOptions ? (
          <Spin tip="加载筛选选项..." />
        ) : (
          <QueryFilter
            fields={queryFields}
            onChange={query.onChange}
            onSearch={handleSearch}
            onReset={handleReset}
            initialValues={fixedParams}
            span={6}
          />
        )}
      </div>

      <div className={styles['list-container']}>
        {table.loading ? (
          <Spin tip="加载文章..." />
        ) : table.data.length === 0 ? (
          <Empty description="暂无文章" />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {table.data.map((post) => (
                <Col xs={24} sm={12} lg={8} key={post.id}>
                  <Card
                    hoverable
                    cover={
                      post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          height={160}
                          style={{ objectFit: 'cover' }}
                          preview={false}
                        />
                      ) : null
                    }
                  >
                    <Card.Meta
                      title={
                        <Link to={`/posts/${post.id}`} className={styles['title-link']}>
                          {post.title}
                        </Link>
                      }
                      description={
                        <>
                          <div>{post.excerpt || '暂无摘要'}</div>
                          <div style={{ marginTop: 8 }}>
                            <small>
                              作者：{post.author?.username || '未知'} |
                              分类：{post.categories?.map((cat: Category) => cat.name).join(', ') || '无'} |
                              发布时间：{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '未发布'}
                            </small>
                          </div>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Pagination
                current={table.pagination.page}
                pageSize={table.pagination.pageSize}
                total={table.pagination.total}
                onChange={table.pagination.onChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 条`}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Posts;