import Image from 'next/image';
import styles from './ToolCard.module.css';

const FALLBACK_EMOJIS = { drill: '🔨', saw: '🪚', ladder: '🪜', washer: '🌀', wrench: '🔧', grinder: '🔩' };
const getEmoji = (title = '') => {
  const t = title.toLowerCase();
  return Object.entries(FALLBACK_EMOJIS).find(([k]) => t.includes(k))?.[1] || '🛠️';
};

export default function ToolCard({ tool, onClick }) {
  const hasImage = tool.image_url && !tool.image_url.includes('dummy-cloud-storage');

  return (
    <article className={styles.card} onClick={() => onClick(tool)} tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(tool)}>
      <div className={styles.imgWrap}>
        {hasImage ? (
          <Image
            src={tool.image_url}
            alt={tool.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 600px) 100vw, 300px"
          />
        ) : (
          <span className={styles.emoji}>{getEmoji(tool.title)}</span>
        )}
        <div className={styles.badge}>Available</div>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{tool.title}</h3>
        <p className={styles.owner}>by {tool.owner_email}</p>
        <p className={styles.desc}>{tool.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>
            €{tool.price_per_day?.toFixed(2)} <span>/ day</span>
          </span>
          <button className={styles.rentBtn}>View details →</button>
        </div>
      </div>
    </article>
  );
}
