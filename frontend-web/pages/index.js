import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import ToolCard from '../components/ToolCard';
import ToolDetail from '../components/ToolDetail';
import { toolsApi } from '../lib/api';
import styles from './index.module.css';

const CATEGORIES = ['All', 'Power tools', 'Hand tools', 'Garden', 'Construction', 'Cleaning'];

const matchesCategory = (tool, cat) => {
  if (cat === 'All') return true;
  const text = `${tool.title} ${tool.description}`.toLowerCase();
  const map = {
    'Power tools': ['drill', 'saw', 'grinder', 'sander', 'jigsaw', 'router'],
    'Hand tools': ['wrench', 'hammer', 'screwdriver', 'plier', 'chisel', 'level'],
    'Garden': ['mower', 'trimmer', 'hedge', 'leaf', 'garden', 'spade'],
    'Construction': ['ladder', 'scaffold', 'tile', 'concrete', 'mixer', 'compactor'],
    'Cleaning': ['washer', 'pressure', 'vacuum', 'steam', 'cleaner'],
  };
  return (map[cat] || []).some((kw) => text.includes(kw));
};

export default function Home() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState(null);
  const [authMode, setAuthMode] = useState(null); // 'login' | 'register' | null

  useEffect(() => {
    toolsApi.getAll()
      .then(setTools)
      .catch(() => setError('Could not load tools. Make sure the tools-service is running on port 8001.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tools.filter((t) =>
      matchesCategory(t, category) &&
      (!q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.owner_email?.toLowerCase().includes(q))
    );
  }, [tools, search, category]);

  const quickSearch = (term) => {
    setSearch(term);
    setCategory('All');
    document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>ToolRent — Borrow Smarter, Build Together</title>
        <meta name="description" content="Rent tools from neighbors. Reduce waste. Save money." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar onAuthClick={setAuthMode} />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Smarter tool sharing in your neighborhood
          </div>
          <h1 className={styles.heroTitle}>
            Why buy when<br />you can <em>borrow?</em>
          </h1>
          <p className={styles.heroSub}>
            ToolRent connects neighbors so power tools get used instead of gathering dust.
            The average drill is used just 13 minutes in its lifetime — let&apos;s change that.
          </p>
          <div className={styles.heroCta}>
            <button className={styles.btnDark} onClick={() => document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' })}>
              Browse tools near you
            </button>
            <button className={styles.btnOutline} onClick={() => setAuthMode('register')}>
              List your tools →
            </button>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statVal}>{tools.length || '—'}</span>
              <span className={styles.statLabel}>Tools available</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statVal}>FastAPI</span>
              <span className={styles.statLabel}>Backend</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statVal}>JWT</span>
              <span className={styles.statLabel}>Auth</span>
            </div>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardInner}>
              <span style={{ fontSize: '4rem' }}>🔨</span>
              <div>
                <p className={styles.heroCardTitle}>Hammer drill</p>
                <p className={styles.heroCardSub}>2 streets away · €8/day</p>
              </div>
              <span className={styles.heroCardBadge}>Available</span>
            </div>
            <div className={styles.heroCardInner} style={{ opacity: 0.6 }}>
              <span style={{ fontSize: '4rem' }}>🪚</span>
              <div>
                <p className={styles.heroCardTitle}>Circular saw</p>
                <p className={styles.heroCardSub}>500m away · €12/day</p>
              </div>
              <span className={styles.heroCardBadge}>Available</span>
            </div>
            <div className={styles.heroCardInner} style={{ opacity: 0.35 }}>
              <span style={{ fontSize: '4rem' }}>🌀</span>
              <div>
                <p className={styles.heroCardTitle}>Pressure washer</p>
                <p className={styles.heroCardSub}>1km away · €15/day</p>
              </div>
              <span className={styles.heroCardBadge}>Available</span>
            </div>
          </div>
          <div className={styles.heroBadge}>
            <span>🌱</span> 2,400kg CO₂ saved this month
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <div className={styles.searchSection}>
        <div className={styles.searchWrap}>
          <div className={styles.searchBar}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search tools — drill, ladder, saw..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.searchClear} onClick={() => setSearch('')}>✕</button>
            )}
          </div>
          <div className={styles.searchTags}>
            {['drill', 'ladder', 'saw', 'pressure washer', 'wrench'].map((t) => (
              <button key={t} className={styles.searchTag} onClick={() => quickSearch(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BROWSE ── */}
      <main id="browse" className={styles.browse}>
        <div className={styles.browseHeader}>
          <div>
            <h2 className={styles.browseTitle}>Available tools</h2>
            <p className={styles.browseCount}>
              {loading ? 'Loading...' : `${filtered.length} tool${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          <Link href="/list" className={styles.addBtn}>+ Add your tool</Link>
        </div>

        {/* Category pills */}
        <div className={styles.catPills}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.catPill} ${category === cat ? styles.catPillActive : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading && (
          <div className={styles.stateWrap}>
            <div className={styles.skeletonGrid}>
              {[...Array(6)].map((_, i) => <div key={i} className={styles.skeleton} />)}
            </div>
          </div>
        )}

        {error && (
          <div className={styles.errorState}>
            <span>⚠️</span>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try again</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className={styles.emptyState}>
            <span>🔍</span>
            <p>No tools found{search ? ` for "${search}"` : ''}.</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }}>Clear filters</button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className={styles.grid}>
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onClick={setSelectedTool} />
            ))}
          </div>
        )}
      </main>

      {/* ── HOW IT WORKS ── */}
      <section className={styles.how}>
        <div className={styles.howInner}>
          <p className={styles.howLabel}>How it works</p>
          <h2 className={styles.howTitle}>Rent in minutes, <em>not days.</em></h2>
          <div className={styles.steps}>
            {[
              { n: '01', icon: '🔍', t: 'Browse & find', d: 'Search our catalog of verified tools. Filter by type, description, and price.' },
              { n: '02', icon: '💬', t: 'Request & confirm', d: 'Send a rental request to the owner. JWT-secured messaging keeps things safe.' },
              { n: '03', icon: '🤝', t: 'Pick up the tool', d: 'Meet your neighbor, collect the tool. Payment is released after confirmation.' },
              { n: '04', icon: '⭐', t: 'Return & review', d: 'Return on time and leave a rating. Build your community trust score.' },
            ].map((s) => (
              <div key={s.n} className={styles.step}>
                <span className={styles.stepNum}>{s.n}</span>
                <span className={styles.stepIcon}>{s.icon}</span>
                <h3 className={styles.stepTitle}>{s.t}</h3>
                <p className={styles.stepDesc}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div>
              <p className={styles.footerLogo}>ToolRent</p>
              <p className={styles.footerSub}>
                A microservices platform for smarter resource sharing.<br />
                Built with FastAPI · Next.js · PostgreSQL · Docker · AWS S3
              </p>
            </div>
            <div className={styles.footerLinks}>
              <Link href="/">Browse</Link>
              <Link href="/list">List a tool</Link>
              <Link href="/about">About</Link>
            </div>
          </div>
          <p className={styles.footerCopy}>
            © 2025 ToolRent — Abdelaali Safir, Amine Mahraoui, Mohamed Halloub · ENSEM · MIT License
          </p>
        </div>
      </footer>

      {/* ── MODALS / DRAWERS ── */}
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitch={setAuthMode}
        />
      )}

      {selectedTool && (
        <ToolDetail
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
          onAuthRequired={() => { setSelectedTool(null); setAuthMode('register'); }}
        />
      )}
    </>
  );
}
