import { Layout } from 'antd';
import { APP_NAME } from '@/config/constants';
import styles from './Footer.module.less';

const { Footer: AntFooter } = Layout;

/**
 * 应用底部组件
 * @description 包含版权信息、备案号等
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          © {currentYear} {APP_NAME}. 保留所有权利。
        </p>
        {/* <p className={styles.links}>
          <a
            href="https://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
          >
            粤ICP备12345678号
          </a>
        </p> */}
        {/* <p className={styles['email-link']}>
          联系邮箱：<a href="mailto:support@example.com">
            support@example.com
          </a>
        </p> */}
      </div>
    </AntFooter>
  );
};

export default Footer;