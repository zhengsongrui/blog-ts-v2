import { useEffect, useRef, useState, useCallback } from "react";
import type { PaginationState, UseTableOptions } from "./types/tableRequest";

const DEFAULT_PAGINATION: PaginationState = {
  page: 1,
  pageSize: 10,
  total: 0,
};

const useTableRequest = <P extends Record<string, any> = any, T = any>({
  request,
  params = {} as P,
  defaultPagination = {},
  manual = false,
}: UseTableOptions<P, T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    ...DEFAULT_PAGINATION,
    ...defaultPagination,
  });

  const fetchedRef = useRef(false);
  const searchParamsSnapshot = useRef<P>(params);

  const fetchData = useCallback(
    async (
      page = pagination.page,
      pageSize = pagination.pageSize,
      currentParams?: P,
    ) => {
      setLoading(true);
      if (currentParams) {
        searchParamsSnapshot.current = currentParams;
      }

      try {
        const rawResult = await request({
          page: page,
          pageSize: pageSize,
          ...searchParamsSnapshot.current,
        });


        let list: T[] = [];
        let total: number = 0;

        if (Array.isArray(rawResult)) {
          // 情况 A: 接口直接返回了数组 [{}, {}]
          list = rawResult;
          console.log(list,total);
          // total = rawResult.length;
        } else if (rawResult && typeof rawResult === "object") {
          // 情况 B: 接口返回了分页对象 { list: [], pagination: {} }
          list = rawResult.data || [];
          total = rawResult.pagination.total || 0;
        }

        setData(list);
        setPagination((p) => ({
          ...p,
          page: page,
          pageSize: pageSize,
          total: total,
        }));
      } catch (error) {
        console.error("Table fetch error:", error);
      } finally {
        setLoading(false);
      }
    },
    [request],
  );

  useEffect(() => {
    if (manual || fetchedRef.current) return;
    fetchedRef.current = true;
    fetchData(DEFAULT_PAGINATION.page, DEFAULT_PAGINATION.pageSize, params);
  }, [manual, fetchData]);

  const onTableChange = (current: number, pageSize: number) => {
    fetchData(current, pageSize);
  };

  return {
    data,
    loading,
    pagination: { ...pagination, onChange: onTableChange },
    reload: (newParams?: P) => fetchData(1, pagination.pageSize, newParams),
  };
};

export default useTableRequest;
