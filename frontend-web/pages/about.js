import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import styles from './about.module.css';

export default function About() {
  const [authMode, setAuthMode] = useState(null);

  return (
    <>
      <Head>
        <title>How it works — ToolRent</title>
        <meta name="description" content="Learn how ToolRent connects neighbors to rent and share tools." />
      </Head>

      <Navbar onAuthClick={setAuthMode} />

      <div className={styles.page}>

        {/* HERO */}
        <section className={styles.hero}>
          <p className={styles.eyebrow}>About ToolRent</p>
          <h1 className={styles.title}>
            Built to reduce waste,<br /><em>one tool at a time.</em>
          </h1>
          <p className={styles.sub}>
            The average power drill is used for just 13 minutes over its entire lifetime.
            Meanwhile, millions of tools sit idle in garages — a colossal waste of resources.
            ToolRent is the microservices platform that fixes this.
          </p>
        </section>

        {/* ARCHITECTURE */}
        <section className={styles.arch}>
          <div className={styles.archInner}>
            <h2 className={styles.sectionTitle}>System architecture</h2>
            <p className={styles.sectionSub}>
              Three independent microservices, each with its own database and responsibility domain.
            </p>
            <div className={styles.archGrid}>
              {[
                {
                  port: ':3000',
                  name: 'frontend-web',
                  tech: 'Next.js',
                  color: '#E8F0FE',
                  desc: 'Server-side rendered React app. Communicates with both backend services via REST. JWT stored in cookies.',
                  endpoints: ['GET /', 'GET /list', 'GET /about'],
                },
                {
                  port: ':8000',
                  name: 'auth-service',
                  tech: 'FastAPI + PostgreSQL',
                  color: '#FEF0E8',
                  desc: 'Identity provider. Handles user registration and login. Issues HS256 JWT tokens with 24-hour expiry.',
                  endpoints: ['POST /register', 'POST /login'],
                },
                {
                  port: ':8001',
                  name: 'tools-service',
                  tech: 'FastAPI + PostgreSQL + S3',
                  color: '#E8FEF0',
                  desc: 'Resource catalog. JWT-protected creation endpoint. Stateless image storage via AWS S3 — keeps the backend horizontally scalable.',
                  endpoints: ['GET /tools', 'POST /tools (JWT)'],
                },
              ].map((s) => (
                <div key={s.name} className={styles.archCard} style={{ '--card-accent': s.color }}>
                  <div className={styles.archPort}>{s.port}</div>
                  <h3 className={styles.archName}>{s.name}</h3>
                  <span className={styles.archTech}>{s.tech}</span>
                  <p className={styles.archDesc}>{s.desc}</p>
                  <div className={styles.archEndpoints}>
                    {s.endpoints.map((ep) => (
                      <code key={ep} className={styles.endpoint}>{ep}</code>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className={styles.how}>
          <div className={styles.howInner}>
            <h2 className={styles.sectionTitleLight}>How renting works</h2>
            <div className={styles.steps}>
              {[
                { n: '01', icon: '🔍', t: 'Search & discover', d: 'Browse the tool catalog — fetched in real time from the tools-service. Filter by keyword or category.' },
                { n: '02', icon: '🔐', t: 'Sign up & authenticate', d: 'Create an account via the auth-service. Your password is bcrypt-hashed, your session is a JWT cookie.' },
                { n: '03', icon: '🤝', t: 'Contact & arrange', d: 'Click "Request to rent" to connect with the tool owner by email. Agree on pickup and return date.' },
                { n: '04', icon: '🛠️', t: 'Use the tool', d: 'Pick up the tool, complete your project. Rental insurance covers accidents during the booking period.' },
                { n: '05', icon: '↩️', t: 'Return & rate', d: 'Return the tool on time, leave a review, and build your community trust score.' },
              ].map((s) => (
                <div key={s.n} className={styles.step}>
                  <span className={styles.stepN}>{s.n}</span>
                  <span className={styles.stepIcon}>{s.icon}</span>
                  <h3 className={styles.stepT}>{s.t}</h3>
                  <p className={styles.stepD}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TECH STACK */}
        <section className={styles.stack}>
          <div className={styles.stackInner}>
            <h2 className={styles.sectionTitle}>Tech stack</h2>
            <div className={styles.stackGrid}>
              {[
                { label: 'Frontend', val: 'Next.js 14' },
                { label: 'Backend', val: 'FastAPI (Python)' },
                { label: 'Auth DB', val: 'PostgreSQL :5433' },
                { label: 'Tools DB', val: 'PostgreSQL :5434' },
                { label: 'Image Storage', val: 'AWS S3' },
                { label: 'Auth', val: 'JWT (HS256)' },
                { label: 'Passwords', val: 'bcrypt' },
                { label: 'Containers', val: 'Docker Compose' },
                { label: 'DB Admin', val: 'pgAdmin :5050' },
              ].map((item) => (
                <div key={item.label} className={styles.stackChip}>
                  <span className={styles.stackLabel}>{item.label}</span>
                  <span className={styles.stackVal}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Ready to get started?</h2>
          <p className={styles.ctaSub}>Join your neighbors on ToolRent — rent what you need, earn from what you own.</p>
          <div className={styles.ctaBtns}>
            <Link href="/" className={styles.ctaBtnDark}>Browse tools →</Link>
            <Link href="/list" className={styles.ctaBtnOutline}>List a tool</Link>
          </div>
          <p className={styles.credit}>
            Built by Abdelaali Safir, Amine Mahraoui & Mohamed Halloub · ENSEM · MIT License
          </p>
        </section>

      </div>

      {authMode && (
        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSwitch={setAuthMode} />
      )}
    </>
  );
}
