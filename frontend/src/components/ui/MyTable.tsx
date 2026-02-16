/**
 * 通用表格组件
 * 基于 Ant Design Table 封装，提供统一的表格样式和功能
 */

import React from 'react';
import { Table } from 'antd';
import type { TableProps, ColumnsType } from 'antd/es/table';
import styles from './MyTable.module.less';

interface MyTableProps<T> extends Omit<TableProps<T>, 'pagination'> {
  /** 表格数据 */
  data: T[];
  /** 表格列配置 */
  columns: ColumnsType<T>;
  /** 加载状态 */
  loading?: boolean;
  /** 是否显示分页 */
  showPagination?: boolean;
  /** 当前页码 */
  currentPage?: number;
  /** 每页大小 */
  pageSize?: number;
  /** 数据总数 */
  total?: number;
  /** 分页配置 */
  pagination?: TableProps<T>['pagination'];
  /** 空状态自定义文本 */
  emptyText?: string;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 行键名 */
  rowKey?: string | ((record: T) => string);
  /** 表格尺寸 */
  size?: 'small' | 'middle' | 'large';
  /** 表格滚动配置 */
  scroll?: { x?: number | string; y?: number | string };
  /** 行选择配置 */
  rowSelection?: TableProps<T>['rowSelection'];
  /** 页码变化回调 */
  onPageChange?: (page: number, pageSize: number) => void;
}

function MyTable<T extends object = any>(props: MyTableProps<T>) {
  const {
    data,
    columns,
    loading = false,
    showPagination = true,
    currentPage = 1,
    pageSize = 10,
    total = 0,
    pagination,
    emptyText = '暂无数据',
    bordered = true,
    rowKey = 'id',
    size = 'middle',
    scroll = { x: 'max-content' },
    rowSelection,
    onPageChange,
    ...restProps
  } = props;

  const handleTableChange = (pagination: any) => {
    if (onPageChange) {
      onPageChange(pagination.current, pagination.pageSize);
    }
  };

  const defaultPagination = showPagination
    ? {
        current: currentPage,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number) => `共 ${total} 条`,
        pageSizeOptions: ['10', '20', '50', '100'],
        ...pagination,
      }
    : false;

  return (
    <div className={styles['my-table']}>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={defaultPagination}
        bordered={bordered}
        rowKey={rowKey}
        size={size}
        scroll={scroll}
        rowSelection={rowSelection}
        onChange={handleTableChange}
        locale={{ emptyText }}
        {...restProps}
      />
    </div>
  );
}

export default MyTable;