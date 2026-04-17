import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { toolsApi } from '../lib/api';
import toast from 'react-hot-toast';
import styles from './account.module.css';

export default function AccountPage() {
  const { user, loading, updateProfile, deleteAccount } = useAuth();
  const [authMode, setAuthMode] = useState(null);
  const [profile, setProfile] = useState({ full_name: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [tools, setTools] = useState([]);
  const [toolsLoading, setToolsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '' });

  useEffect(() => {
    if (user) {
      setProfile((p) => ({ ...p, full_name: user.full_name || '' }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setToolsLoading(true);
      try {
        const data = await toolsApi.getMine();
        setTools(data);
      } catch {
        toast.error('Could not load your offers');
      } finally {
        setToolsLoading(false);
      }
    };
    load();
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    const payload = {};
    const nextName = profile.full_name.trim();
    if (nextName && nextName !== user.full_name) payload.full_name = nextName;
    if (profile.password.trim()) payload.password = profile.password.trim();

    if (Object.keys(payload).length === 0) {
      toast('No changes to save');
      return;
    }

    setSaving(true);
    try {
      await updateProfile(payload);
      setProfile((p) => ({ ...p, password: '' }));
      toast.success('Profile updated');
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (tool) => {
    setEditingId(tool.id);
    setEditForm({
      title: tool.title || '',
      description: tool.description || '',
      price: String(tool.price_per_day || ''),
    });
  };

  const handleOfferSave = async (toolId) => {
    const payload = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      price: Number(editForm.price),
    };

    if (!payload.title || !payload.description || !payload.price) {
      toast.error('All fields are required');
      return;
    }

    try {
      const updated = await toolsApi.update(toolId, payload);
      setTools((prev) => prev.map((t) => (t.id === toolId ? updated : t)));
      setEditingId(null);
      toast.success('Offer updated');
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to update offer';
      toast.error(msg);
    }
  };

  const handleOfferDelete = async (toolId) => {
    const ok = window.confirm('Delete this offer? This cannot be undone.');
    if (!ok) return;
    try {
      await toolsApi.remove(toolId);
      setTools((prev) => prev.filter((t) => t.id !== toolId));
      toast.success('Offer deleted');
    } catch {
      toast.error('Failed to delete offer');
    }
  };

  const handleDeleteAccount = async () => {
    const ok = window.confirm('Delete your account? This cannot be undone.');
    if (!ok) return;
    try {
      await deleteAccount();
      toast.success('Account deleted');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  return (
    <>
      <Head>
        <title>Account - ToolRent</title>
        <meta name="description" content="Manage your account, offers, and settings." />
      </Head>

      <Navbar onAuthClick={setAuthMode} />

      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Account</h1>
            <p>Manage your profile and offers in one place.</p>
          </div>

          {loading && <div className={styles.loading}>Loading your profile...</div>}

          {!loading && !user && (
            <div className={styles.signInCard}>
              <h2>Sign in required</h2>
              <p>Sign in to manage your account and offers.</p>
              <button className={styles.signInBtn} onClick={() => setAuthMode('login')}>
                Sign in
              </button>
            </div>
          )}

          {!loading && user && (
            <div className={styles.grid}>
              <section className={styles.profileCard}>
                <h2>Profile</h2>
                <form onSubmit={handleProfileSave} className={styles.profileForm}>
                  <label>
                    Full name
                    <input
                      type="text"
                      value={profile.full_name}
                      onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                    />
                  </label>

                  <label>
                    New password
                    <input
                      type="password"
                      value={profile.password}
                      onChange={(e) => setProfile((p) => ({ ...p, password: e.target.value }))}
                      placeholder="Leave blank to keep current"
                    />
                  </label>

                  <button type="submit" disabled={saving} className={styles.saveBtn}>
                    {saving ? 'Saving...' : 'Save changes'}
                  </button>
                </form>

                <div className={styles.dangerZone}>
                  <h3>Danger zone</h3>
                  <p>Deleting your account is permanent.</p>
                  <button className={styles.deleteBtn} onClick={handleDeleteAccount}>
                    Delete account
                  </button>
                </div>
              </section>

              <section className={styles.offersCard}>
                <div className={styles.offersHeader}>
                  <h2>Your offers</h2>
                  <span>{tools.length} active</span>
                </div>

                {toolsLoading && <div className={styles.loading}>Loading offers...</div>}

                {!toolsLoading && tools.length === 0 && (
                  <div className={styles.emptyOffers}>
                    <p>You have not listed any tools yet.</p>
                    <Link href="/list" className={styles.listBtn}>List a tool</Link>
                  </div>
                )}

                {!toolsLoading && tools.length > 0 && (
                  <div className={styles.offerList}>
                    {tools.map((tool) => (
                      <div key={tool.id} className={styles.offerRow}>
                        <div className={styles.offerInfo}>
                          <h3>{tool.title}</h3>
                          <p>{tool.description}</p>
                          <span>EUR {tool.price_per_day?.toFixed(2)} / day</span>
                        </div>

                        {editingId === tool.id ? (
                          <div className={styles.offerEdit}>
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                              placeholder="Title"
                            />
                            <textarea
                              value={editForm.description}
                              onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                              rows={3}
                            />
                            <div className={styles.offerEditRow}>
                              <input
                                type="number"
                                min="0.5"
                                step="0.5"
                                value={editForm.price}
                                onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                              />
                              <button onClick={() => handleOfferSave(tool.id)}>
                                Save
                              </button>
                              <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={() => setEditingId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={styles.offerActions}>
                            <button onClick={() => startEdit(tool)}>Edit</button>
                            <button className={styles.deleteOfferBtn} onClick={() => handleOfferDelete(tool.id)}>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
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
