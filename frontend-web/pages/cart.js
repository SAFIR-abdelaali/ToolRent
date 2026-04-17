import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './cart.module.css';

const getBadge = (title = '') => (title.trim()[0] || 'T').toUpperCase();

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (!user) {
      setAuthMode('login');
      return;
    }
    setCheckoutMessage('Thank you for your request! We will contact you soon.');
    clearCart();
  };

  return (
    <>
      <Head>
        <title>Your Cart - ToolRent</title>
        <meta name="description" content="Review your selected tools and prepare your rental." />
      </Head>

      <Navbar onAuthClick={setAuthMode} />

      <div className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Rental cart</p>
              <h1 className={styles.title}>Your picks</h1>
              <p className={styles.sub}>Review tools, adjust days, and get ready to request a rental.</p>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <strong>EUR {subtotal.toFixed(2)}</strong>
              </div>
              <p className={styles.summaryNote}>Totals are estimated per day. Final price is confirmed by the owner.</p>
              <button className={styles.checkoutBtn} disabled={items.length === 0} onClick={handleCheckout}>
                Checkout
              </button>
              {!user && (
                <button className={styles.signInBtn} onClick={() => setAuthMode('login')}>
                  Sign in to request
                </button>
              )}
            </div>
          </header>

          {checkoutMessage && (
            <div className={styles.checkoutNotice}>
              {checkoutMessage}
            </div>
          )}

          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>TR</span>
              <h2>Your cart is empty</h2>
              <p>Browse the catalog and add tools to start a rental request.</p>
              <Link href="/" className={styles.browseBtn}>Browse tools</Link>
            </div>
          ) : (
            <div className={styles.cartGrid}>
              <div className={styles.list}>
                {items.map((item) => {
                  const hasImage = item.image_url && !item.image_url.includes('dummy-cloud-storage');
                  return (
                    <div key={item.id} className={styles.item}>
                      <div className={styles.itemMedia}>
                        {hasImage ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            sizes="120px"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <span className={styles.itemGlyph}>{getBadge(item.title)}</span>
                        )}
                      </div>
                      <div className={styles.itemBody}>
                        <h3>{item.title}</h3>
                        <p>Owner: {item.owner_email}</p>
                        <div className={styles.itemMeta}>
                          <span className={styles.itemPrice}>EUR {item.price_per_day.toFixed(2)} / day</span>
                          <div className={styles.qtyControl}>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => updateQty(item.id, e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className={styles.itemActions}>
                        <span className={styles.itemTotal}>
                          EUR {(item.price_per_day * item.qty).toFixed(2)}
                        </span>
                        <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <aside className={styles.sideCard}>
                <div className={styles.sideHeader}>
                  <h2>Cart summary</h2>
                  <p>{items.length} tool{items.length !== 1 ? 's' : ''}</p>
                </div>
                <div className={styles.sideRow}>
                  <span>Subtotal</span>
                  <strong>EUR {subtotal.toFixed(2)}</strong>
                </div>
                <div className={styles.sideRowMuted}>
                  <span>Service fees</span>
                  <span>Included</span>
                </div>
                <button className={styles.checkoutBtn} disabled={items.length === 0} onClick={handleCheckout}>
                  Checkout
                </button>
                {!user && (
                  <button className={styles.signInBtn} onClick={() => setAuthMode('login')}>
                    Sign in to request
                  </button>
                )}
                <button className={styles.clearBtn} onClick={clearCart}>
                  Clear cart
                </button>
              </aside>
            </div>
          )}
        </div>
      </div>

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitch={setAuthMode}
        />
      )}
    </>
  );
}
