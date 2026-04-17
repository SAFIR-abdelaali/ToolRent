import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import styles from './ToolDetail.module.css';

const FALLBACK_EMOJIS = { drill: '🔨', saw: '🪚', ladder: '🪜', washer: '🌀', wrench: '🔧', grinder: '🔩' };
const getEmoji = (title = '') => {
  const t = title.toLowerCase();
  return Object.entries(FALLBACK_EMOJIS).find(([k]) => t.includes(k))?.[1] || '🛠️';
};

export default function ToolDetail({ tool, onClose, onAuthRequired }) {
  const { user } = useAuth();
  const { addItem, items } = useCart();
  const hasImage = tool?.image_url && !tool.image_url.includes('dummy-cloud-storage');
  const inCart = items.some((item) => item.id === tool?.id);

  const handleAddToCart = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    addItem(tool);
    toast.success('Added to cart');
  };

  if (!tool) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <aside className={styles.drawer}>
        <button className={styles.closeBtn} onClick={onClose}>← Back</button>

        <div className={styles.imgWrap}>
          {hasImage ? (
            <Image src={tool.image_url} alt={tool.title} fill style={{ objectFit: 'cover' }}
              sizes="480px" />
          ) : (
            <span className={styles.emoji}>{getEmoji(tool.title)}</span>
          )}
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>{tool.title}</h2>
          <p className={styles.owner}>Listed by <strong>{tool.owner_email}</strong></p>

          <div className={styles.metaGrid}>
            <div className={styles.metaChip}>
              <span className={styles.metaLabel}>Status</span>
              <span className={styles.metaVal} style={{ color: 'var(--success)' }}>● Available</span>
            </div>
            <div className={styles.metaChip}>
              <span className={styles.metaLabel}>Min. rental</span>
              <span className={styles.metaVal}>1 day</span>
            </div>
            <div className={styles.metaChip}>
              <span className={styles.metaLabel}>Tool ID</span>
              <span className={styles.metaVal}>#{tool.id}</span>
            </div>
            <div className={styles.metaChip}>
              <span className={styles.metaLabel}>Insurance</span>
              <span className={styles.metaVal}>✓ Covered</span>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>About this tool</h3>
            <p className={styles.desc}>{tool.description}</p>
          </div>

          <div className={styles.priceRow}>
            <div>
              <p className={styles.priceLabel}>Rental price</p>
              <p className={styles.price}>
                €{tool.price_per_day?.toFixed(2)}
                <span> / day</span>
              </p>
            </div>
            <div className={styles.priceTotals}>
              <span>3 days: <b>€{(tool.price_per_day * 3).toFixed(2)}</b></span>
              <span>7 days: <b>€{(tool.price_per_day * 7).toFixed(2)}</b></span>
            </div>
          </div>

          <button className={styles.rentBtn} onClick={handleAddToCart}>
            {user ? (inCart ? 'Add another' : 'Add to cart') : 'Sign in to add'}
          </button>

          {!user && (
            <p className={styles.authNote}>
              You need an account to add tools to your cart.{' '}
              <button className={styles.authLink} onClick={onAuthRequired}>Sign up free →</button>
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
