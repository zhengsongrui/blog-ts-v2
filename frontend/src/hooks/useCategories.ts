/**
 * 分类管理自定义 Hook
 * 封装分类相关的数据获取和操作逻辑
 */

import { useState, useCallback } from 'react';
import { message } from 'antd';
import { categoryApi } from '@/api/endpoints';
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryQueryParams,
  PaginatedResponseCategory,
} from '@/api/types';
import { PAGINATION } from '@/config/constants';

interface UseCategoriesReturn {
  // 状态
  categories: Category[];
  loading: boolean;
  error: string | null;
  pagination: PaginatedResponseCategory['pagination'] | null;
  
  // 操作方法
  fetchCategories: (params?: CategoryQueryParams) => Promise<void>;
  fetchAllCategories: () => Promise<Category[]>;
  fetchCategoryById: (id: string) => Promise<Category | null>;
  createCategory: (data: CreateCategoryDto) => Promise<Category | null>;
  updateCategory: (id: string, data: UpdateCategoryDto) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<boolean>;
  
  // 状态设置
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * 分类管理 Hook
 * @param initialParams 初始查询参数
 */
export function useCategories(initialParams?: CategoryQueryParams): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginatedResponseCategory['pagination'] | null>(null);
  const [queryParams, setQueryParams] = useState<CategoryQueryParams>(
    initialParams || {
      page: PAGINATION.DEFAULT_PAGE,
      pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }
  );

  /**
   * 获取分类列表（分页）
   */
  const fetchCategories = useCallback(async (params?: CategoryQueryParams) => {
    setLoading(true);
    setError(null);
    
    try {
      // 先更新 queryParams，然后使用更新后的值进行 API 调用
      setQueryParams(prev => {
        const mergedParams = { ...prev, ...params };
        
        // 在 setQueryParams 回调中发起 API 调用
        categoryApi.getCategories(mergedParams)
          .then(paginatedResponse => {
            if (paginatedResponse.success) {
              setCategories(paginatedResponse.data);
              setPagination(paginatedResponse.pagination);
            } else {
              throw new Error(paginatedResponse.error?.message || '获取分类列表失败');
            }
          })
          .catch((err: any) => {
            const errorMessage = err.message || '获取分类列表失败，请稍后重试';
            setError(errorMessage);
            message.error(errorMessage);
          })
          .finally(() => {
            setLoading(false);
          });
        
        return mergedParams;
      });
    } catch (err: any) {
      const errorMessage = err.message || '获取分类列表失败，请稍后重试';
      setError(errorMessage);
      message.error(errorMessage);
      setLoading(false);
    }
  }, []);

  /**
   * 获取所有分类（不分页）
   */
  const fetchAllCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const categories = await categoryApi.getAllCategories();
      setLoading(false);
      return categories;
    } catch (err: any) {
      const errorMessage = err.message || '获取所有分类失败，请稍后重试';
      setError(errorMessage);
      setLoading(false);
      message.error(errorMessage);
      return [];
    }
  }, []);

  /**
   * 根据ID获取分类
   */
  const fetchCategoryById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const category = await categoryApi.getCategoryById(id);
      setLoading(false);
      return category;
    } catch (err: any) {
      const errorMessage = err.message || '获取分类详情失败，请稍后重试';
      setError(errorMessage);
      setLoading(false);
      message.error(errorMessage);
      return null;
    }
  }, []);

  /**
   * 创建分类
   */
  const createCategory = useCallback(async (data: CreateCategoryDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const category = await categoryApi.createCategory(data);
      setLoading(false);
      message.success('分类创建成功');
      
      // 刷新列表
      await fetchCategories();
      
      return category;
    } catch (err: any) {
      const errorMessage = err.message || '创建分类失败，请稍后重试';
      setError(errorMessage);
      setLoading(false);
      message.error(errorMessage);
      return null;
    }
  }, [fetchCategories]);

  /**
   * 更新分类
   */
  const updateCategory = useCallback(async (id: string, data: UpdateCategoryDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const category = await categoryApi.updateCategory(id, data);
      setLoading(false);
      message.success('分类更新成功');
      
      // 刷新列表
      await fetchCategories();
      
      return category;
    } catch (err: any) {
      const errorMessage = err.message || '更新分类失败，请稍后重试';
      setError(errorMessage);
      setLoading(false);
      message.error(errorMessage);
      return null;
    }
  }, [fetchCategories]);

  /**
   * 删除分类
   */
  const deleteCategory = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await categoryApi.deleteCategory(id);
      setLoading(false);
      message.success('分类删除成功');
      
      // 从本地状态中移除
      setCategories(prev => prev.filter(cat => cat.id !== id));
      
      return true;
    } catch (err: any) {
      const errorMessage = err.message || '删除分类失败，请稍后重试';
      setError(errorMessage);
      setLoading(false);
      message.error(errorMessage);
      return false;
    }
  }, []);

  return {
    // 状态
    categories,
    loading,
    error,
    pagination,
    
    // 操作方法
    fetchCategories,
    fetchAllCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // 状态设置
    setCategories,
    setLoading,
    setError,
  };
}