import styles from './ToolCard.module.css';
import ToolImage from './ToolImage';

export default function ToolCard({ tool, onClick }) {
  return (
    <article className={styles.card} onClick={() => onClick(tool)} tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(tool)}>
      <div className={styles.imgWrap}>
        <ToolImage
          imageUrl={tool.image_url}
          title={tool.title}
          className={styles.emoji}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 600px) 100vw, 300px"
        />
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
