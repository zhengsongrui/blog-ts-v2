import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './Loading.module.less';

/**
 * 全局加载组件
 * @description 提供统一的加载状态显示
 */
interface LoadingProps {
  /** 加载提示文本 */
  tip?: string;
  /** 是否全屏显示 */
  fullscreen?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 自定义尺寸 */
  size?: 'small' | 'default' | 'large';
}

export const Loading: React.FC<LoadingProps> = ({
  tip = '加载中...',
  fullscreen = false,
  className = '',
  size = 'large',
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  if (fullscreen) {
    return (
      <div className={`${styles['loading-fullscreen']} ${className}`}>
        <Spin indicator={antIcon} tip={tip} size={size} />
      </div>
    );
  }

  return <Spin indicator={antIcon} tip={tip} size={size} className={className} />;
};

export default Loading;