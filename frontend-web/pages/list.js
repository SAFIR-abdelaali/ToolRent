import { useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { toolsApi } from '../lib/api';
import styles from './list.module.css';

export default function ListTool() {
  const { user } = useAuth();
  const router = useRouter();
  const [authMode, setAuthMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', price: '' });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onDrop = useCallback((accepted) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropRejected: () => toast.error('File too large or unsupported format (max 5MB)'),
  });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Enter a valid price';
    if (!file) e.file = 'Please upload an image of your tool';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { setAuthMode('login'); return; }
    if (!validate()) return;

    setLoading(true);
    try {
      await toolsApi.create({
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        file,
      });
      toast.success('Tool listed successfully!');
      router.push('/');
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to list tool. Please try again.';
      toast.error(Array.isArray(msg) ? msg.map((m) => m.msg).join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>List a Tool — ToolRent</title>
        <meta name="description" content="List your idle tool and earn money by renting it to neighbors." />
      </Head>

      <Navbar onAuthClick={setAuthMode} />

      <div className={styles.page}>
        <div className={styles.container}>

          {/* Left — form */}
          <div className={styles.formSide}>
            <div className={styles.formHeader}>
              <h1 className={styles.title}>List your tool</h1>
              <p className={styles.sub}>
                Upload your tool details. It&apos;ll be live for renters as soon as you submit.
              </p>
            </div>

            {!user && (
              <div className={styles.authBanner}>
                <span>🔒</span>
                <span>
                  You need to be signed in to list a tool.{' '}
                  <button onClick={() => setAuthMode('login')} className={styles.authBannerLink}>
                    Sign in →
                  </button>
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {/* Tool image */}
              <div className={styles.field}>
                <label className={styles.label}>Tool photo *</label>
                <div
                  {...getRootProps()}
                  className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''} ${errors.file ? styles.dropzoneError : ''}`}
                >
                  <input {...getInputProps()} />
                  {preview ? (
                    <div className={styles.previewWrap}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt="Preview" className={styles.previewImg} />
                      <button
                        type="button"
                        className={styles.removeImg}
                        onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <div className={styles.dropzoneInner}>
                      <span className={styles.dropzoneIcon}>📸</span>
                      <p className={styles.dropzoneText}>
                        {isDragActive ? 'Drop it here!' : 'Drag & drop a photo, or click to browse'}
                      </p>
                      <p className={styles.dropzoneHint}>JPG, PNG, WebP · Max 5MB</p>
                    </div>
                  )}
                </div>
                {errors.file && <p className={styles.fieldError}>{errors.file}</p>}
              </div>

              {/* Title */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="title">Tool name *</label>
                <input
                  id="title"
                  className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                  type="text"
                  placeholder="e.g. Bosch Hammer Drill GSB 18V"
                  value={form.title}
                  onChange={set('title')}
                  maxLength={80}
                />
                {errors.title && <p className={styles.fieldError}>{errors.title}</p>}
              </div>

              {/* Description */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  className={`${styles.input} ${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                  placeholder="Describe the tool — brand, model, condition, what it's good for, accessories included..."
                  value={form.description}
                  onChange={set('description')}
                  rows={4}
                  maxLength={500}
                />
                <p className={styles.charCount}>{form.description.length}/500</p>
                {errors.description && <p className={styles.fieldError}>{errors.description}</p>}
              </div>

              {/* Price */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="price">Price per day (€) *</label>
                <div className={styles.priceWrap}>
                  <span className={styles.priceCurrency}>€</span>
                  <input
                    id="price"
                    className={`${styles.input} ${styles.priceInput} ${errors.price ? styles.inputError : ''}`}
                    type="number"
                    placeholder="0.00"
                    value={form.price}
                    onChange={set('price')}
                    min="0.5"
                    max="500"
                    step="0.5"
                  />
                </div>
                {errors.price && <p className={styles.fieldError}>{errors.price}</p>}
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading || !user}
              >
                {loading ? (
                  <span className={styles.spinner} />
                ) : '🛠️  Publish my tool'}
              </button>
            </form>
          </div>

          {/* Right — preview & tips */}
          <div className={styles.infoSide}>
            <div className={styles.previewCard}>
              <p className={styles.previewCardLabel}>Live preview</p>
              <div className={styles.previewCardImg}>
                {preview
                  ? <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '4rem' }}>🛠️</span>}
              </div>
              <div className={styles.previewCardBody}>
                <p className={styles.previewCardTitle}>{form.title || 'Your tool name'}</p>
                <p className={styles.previewCardOwner}>by {user?.email || 'you@example.com'}</p>
                <p className={styles.previewCardDesc}>
                  {form.description || 'Your description will appear here...'}
                </p>
                <div className={styles.previewCardFooter}>
                  <span className={styles.previewCardPrice}>
                    {form.price ? `€${parseFloat(form.price).toFixed(2)}` : '€—'} <span>/ day</span>
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.tips}>
              <h3 className={styles.tipsTitle}>Tips for a great listing</h3>
              <ul className={styles.tipsList}>
                <li>📸 Use a clear, well-lit photo</li>
                <li>✏️ Include brand, model & condition</li>
                <li>📦 Mention accessories included</li>
                <li>💰 Research fair market prices</li>
                <li>🔒 Images go straight to AWS S3</li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {authMode && (
        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSwitch={setAuthMode} />
      )}
    </>
  );
}
