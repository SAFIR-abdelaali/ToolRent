import Link from 'next/link';
import styles from './404.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <span className={styles.icon}>🔧</span>
      <h1 className={styles.code}>404</h1>
      <p className={styles.msg}>This tool has gone missing.</p>
      <Link href="/" className={styles.back}>← Back to browse</Link>
    </div>
  );
}
