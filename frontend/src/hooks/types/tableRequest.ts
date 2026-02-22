// types.ts

import type { ApiResponse } from "@/api/types";

/** 分页状态结构 */
export interface PaginationState {
  hasNext?: boolean;
  hasPrev?: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages?: number;
}

/** Hook 的配置项 */
export interface UseTableOptions<P, T> {
  // 请求函数，支持分页参数和自定义参数
  request: (
    params: P & { page: number; pageSize: number },
  ) => Promise<ApiResponse<T> | T[] | any>;
  params?: P;
  defaultPagination?: Partial<PaginationState>;
  manual?: boolean;
}
