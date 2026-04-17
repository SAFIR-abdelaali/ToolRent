import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import styles from './Navbar.module.css';

export default function Navbar({ onAuthClick }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    router.push('/');
  };

  const isActive = (href) => router.pathname === href;

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        <span className={styles.logoIcon}>
          <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
            <path d="M22 9V7h-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14z"/>
            <path d="M6 13h5v4H6zm0-6h8v4H6z"/>
          </svg>
        </span>
        ToolRent
      </Link>

      <ul className={styles.links}>
        <li><Link href="/" className={isActive('/') ? styles.active : ''}>Browse</Link></li>
        <li><Link href="/about" className={isActive('/about') ? styles.active : ''}>How it works</Link></li>
        {user && <li><Link href="/list" className={isActive('/list') ? styles.active : ''}>List a tool</Link></li>}
        {user && <li><Link href="/account" className={isActive('/account') ? styles.active : ''}>Account</Link></li>}
      </ul>

      <div className={styles.right}>
        {user ? (
          <>
            <span className={styles.userEmail}>{user.email}</span>
            <Link href="/cart" className={styles.cartLink}>
              Cart
              {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
            </Link>
            <Link href="/account" className={styles.btnGhost}>Account</Link>
            <Link href="/list" className={styles.btnPrimary}>+ Add tool</Link>
            <button className={styles.btnGhost} onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <>
            <Link href="/cart" className={styles.cartLink}>
              Cart
              {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
            </Link>
            <button className={styles.btnGhost} onClick={() => onAuthClick('login')}>Sign in</button>
            <button className={styles.btnPrimary} onClick={() => onAuthClick('register')}>Get started</button>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span /><span /><span />
      </button>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Browse tools</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>How it works</Link>
          <Link href="/cart" onClick={() => setMenuOpen(false)}>
            Cart {itemCount > 0 ? `(${itemCount})` : ''}
          </Link>
          {user ? (
            <>
              <Link href="/list" onClick={() => setMenuOpen(false)}>+ Add tool</Link>
              <Link href="/account" onClick={() => setMenuOpen(false)}>Account</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Sign out</button>
            </>
          ) : (
            <>
              <button onClick={() => { onAuthClick('login'); setMenuOpen(false); }}>Sign in</button>
              <button onClick={() => { onAuthClick('register'); setMenuOpen(false); }}>Get started</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
