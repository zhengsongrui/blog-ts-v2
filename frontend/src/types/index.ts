import type { Rule } from "antd/es/form";

/** 
 * 定义单个表单项的配置接口 
 */
export interface QueryFieldItem {
  name: string;
  label: string;
  component: React.ReactNode;
  span?: number;
  rules?: Rule[];
  /** 转换值的特殊方法，供 onChange 回调使用 */
  transformChangeValue?: (value: any) => any;
}