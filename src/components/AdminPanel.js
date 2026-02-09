import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as db from '../dataStore';
import './AdminPanel.css';

const ADMIN_PASSWORD = 'adham2025';

const AdminPanel = ({ isOpen, onClose, language, translations }) => {
  const t = translations[language];

  /* ─── Auth ─── */
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  /* ─── Data ─── */
  const [workSamples, setWorkSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ─── Views: 'list' | 'form' | 'images' ─── */
  const [currentView, setCurrentView] = useState('list');
  const [selectedSample, setSelectedSample] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  /* ─── Form ─── */
  const [formData, setFormData] = useState({
    name: '',
  });
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'

  /* ─── Images ─── */
  const [uploading, setUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  /* ─── Delete ─── */
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteImageId, setDeleteImageId] = useState(null);

  /* ─── Toast ─── */
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ════════════════════════════════════════════
     FETCH
  ════════════════════════════════════════════ */
  const fetchWorkSamples = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db.getFolders(false);
    if (error) { console.error(error); setLoading(false); return; }
    setWorkSamples(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen && isAuthenticated) fetchWorkSamples();
  }, [isOpen, isAuthenticated, fetchWorkSamples]);

  /* lock body scroll */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ════════════════════════════════════════════
     AUTH
  ════════════════════════════════════════════ */
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
      setLoginError('');
    } else {
      setLoginError(t.wrongPassword || 'Wrong password!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('list');
    setSelectedSample(null);
  };

  /* ════════════════════════════════════════════
     CRUD – CREATE / UPDATE
  ════════════════════════════════════════════ */
  const openCreateForm = () => {
    setFormData({ name: '' });
    setFormMode('create');
    setCurrentView('form');
  };

  const openEditForm = (sample) => {
    setFormData({
      name: sample.name || '',
    });
    setSelectedSample(sample);
    setFormMode('edit');
    setCurrentView('form');
  };

  const handleSaveForm = async () => {
    if (!formData.name.trim()) return;

    const payload = {
      name: formData.name.trim(),
    };

    if (formMode === 'edit' && selectedSample) {
      const { error } = await db.updateFolder(selectedSample.id, payload);
      if (error) { showToast(t.adminErrorSaving || 'Error saving', 'error'); console.error(error); return; }
      setWorkSamples(prev => prev.map(s => s.id === selectedSample.id ? { ...s, ...payload } : s));
      showToast(t.adminUpdated || 'Work sample updated!');
    } else {
      const { data, error } = await db.createFolder(payload);
      if (error) { showToast(t.adminErrorSaving || 'Error saving', 'error'); console.error(error); return; }
      setWorkSamples(prev => [{ ...data, images: [] }, ...prev]);
      showToast(t.adminCreated || 'Work sample created!');
    }
    setCurrentView('list');
    setSelectedSample(null);
  };

  /* ════════════════════════════════════════════
     CRUD – DELETE
  ════════════════════════════════════════════ */
  const handleDelete = async (id) => {
    const { error } = await db.deleteFolder(id);
    if (error) { showToast(t.adminErrorDeleting || 'Error deleting', 'error'); console.error(error); return; }

    setWorkSamples(prev => prev.filter(s => s.id !== id));
    setDeleteConfirm(null);
    if (selectedSample && selectedSample.id === id) {
      setSelectedSample(null);
      setCurrentView('list');
    }
    showToast(t.adminDeleted || 'Work sample deleted!');
  };

  /* ════════════════════════════════════════════
     IMAGES – Upload / URL / Delete
  ════════════════════════════════════════════ */
  const openImagesView = (sample) => {
    setSelectedSample(sample);
    setCurrentView('images');
    setShowUrlInput(false);
    setImageUrlInput('');
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !selectedSample) return;
    setUploading(true);

    try {
      const { data: newImages, error } = await db.uploadImages(selectedSample.id, files);
      if (error) { showToast('Upload failed', 'error'); console.error(error); }

      if (newImages && newImages.length) {
        const updated = { ...selectedSample, images: [...selectedSample.images, ...newImages] };
        setSelectedSample(updated);
        setWorkSamples(prev => prev.map(s => s.id === selectedSample.id ? updated : s));
        showToast(`${newImages.length} image(s) uploaded!`);
      }
    } catch (err) {
      console.error(err);
      showToast('Upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = async () => {
    if (!imageUrlInput.trim() || !selectedSample) return;

    const { data: newImg, error } = await db.addImageUrl(
      selectedSample.id,
      imageUrlInput.trim(),
      selectedSample.images.length
    );
    if (error) { showToast('Error adding image', 'error'); console.error(error); return; }

    const updated = { ...selectedSample, images: [...selectedSample.images, newImg] };
    setSelectedSample(updated);
    setWorkSamples(prev => prev.map(s => s.id === selectedSample.id ? updated : s));
    setImageUrlInput('');
    setShowUrlInput(false);
    showToast('Image added!');
  };

  const handleDeleteImage = async (imgIndex) => {
    if (!selectedSample) return;
    const img = selectedSample.images[imgIndex];

    const { error } = await db.deleteImage(img.id);
    if (error) { showToast('Error deleting image', 'error'); console.error(error); return; }

    const updated = { ...selectedSample, images: selectedSample.images.filter((_, i) => i !== imgIndex) };
    setSelectedSample(updated);
    setWorkSamples(prev => prev.map(s => s.id === selectedSample.id ? updated : s));
    setDeleteImageId(null);
    showToast('Image deleted!');
  };

  /* ════════════════════════════════════════════
     TOGGLE FEATURED
  ════════════════════════════════════════════ */


  /* ════════════════════════════════════════════
     FILTER
  ════════════════════════════════════════════ */
  const filtered = workSamples.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q);
  });

  /* stats */
  const totalImages = workSamples.reduce((a, s) => a + s.images.length, 0);

  if (!isOpen) return null;

  /* ════════════════════════════════════════════
     RENDER — LOGIN
  ════════════════════════════════════════════ */
  if (!isAuthenticated) {
    return (
      <div className="admin-backdrop" onClick={onClose}>
        <div className="admin-login-card" onClick={e => e.stopPropagation()}>
          <button className="admin-login-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
          <div className="admin-login-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h2>{t.adminLogin || 'Admin Login'}</h2>
          <p className="admin-login-sub">{t.adminLoginSub || 'Enter password to access the admin panel'}</p>
          <input
            type="password"
            placeholder={t.enterPassword || 'Enter password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            autoFocus
          />
          {loginError && <p className="admin-error">{loginError}</p>}
          <button className="admin-login-submit" onClick={handleLogin}>
            <i className="fas fa-sign-in-alt"></i> {t.loginBtn || 'Login'}
          </button>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════
     RENDER — DASHBOARD
  ════════════════════════════════════════════ */
  return (
    <div className="admin-backdrop">
      <div className="admin-panel" onClick={e => e.stopPropagation()}>
        {/* ── Header ── */}
        <header className="admin-header">
          <div className="admin-header-left">
            {currentView !== 'list' && (
              <button className="admin-back-btn" onClick={() => { setCurrentView('list'); setSelectedSample(null); }}>
                <i className={`fas fa-arrow-${language === 'ar' ? 'right' : 'left'}`}></i>
              </button>
            )}
            <div className="admin-header-title">
              <i className="fas fa-cogs"></i>
              <h2>
                {currentView === 'list' && (t.adminDashboard || 'Admin Dashboard')}
                {currentView === 'form' && (formMode === 'edit' ? (t.editProject || 'Edit Work Sample') : (t.adminCreateNew || 'New Work Sample'))}
                {currentView === 'images' && (t.adminManageImages || 'Manage Images')}
              </h2>
            </div>
          </div>
          <div className="admin-header-right">
            <button className="admin-logout-button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> {t.adminLogout || 'Logout'}
            </button>
            <button className="admin-close-button" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="admin-content">

          {/* ═══ LIST VIEW ═══ */}
          {currentView === 'list' && (
            <>
              {/* Stats */}
              <div className="admin-stats">
                <div className="admin-stat-card">
                  <i className="fas fa-folder-open"></i>
                  <div>
                    <span className="stat-number">{workSamples.length}</span>
                    <span className="stat-label">{t.adminTotalSamples || 'Work Samples'}</span>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <i className="fas fa-images"></i>
                  <div>
                    <span className="stat-number">{totalImages}</span>
                    <span className="stat-label">{t.adminTotalImages || 'Total Images'}</span>
                  </div>
                </div>

              </div>

              {/* Toolbar */}
              <div className="admin-toolbar">
                <div className="admin-search-wrap">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder={t.adminSearchPlaceholder || 'Search work samples...'}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="admin-search-clear" onClick={() => setSearchQuery('')}>
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
                <button className="admin-create-btn" onClick={openCreateForm}>
                  <i className="fas fa-plus"></i> {t.adminCreateNew || 'New Work Sample'}
                </button>
              </div>

              {/* Table / Cards */}
              {loading ? (
                <div className="admin-loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  <p>{t.adminLoading || 'Loading...'}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="admin-empty">
                  <i className="fas fa-inbox"></i>
                  <p>{searchQuery ? (t.adminNoResults || 'No results found') : (t.noProjects || 'No work samples yet')}</p>
                  {!searchQuery && (
                    <button className="admin-create-btn" onClick={openCreateForm}>
                      <i className="fas fa-plus"></i> {t.adminCreateFirst || 'Create your first work sample'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>{t.adminThumb || 'Thumb'}</th>
                        <th>{t.projectName || 'Name'}</th>
                        <th>{t.images || 'Images'}</th>
                        <th>{t.adminActions || 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(sample => (
                        <tr key={sample.id}>
                          <td>
                            <div className="admin-thumb">
                              {sample.images.length > 0 ? (
                                <img src={sample.images[0].url} alt={sample.name} />
                              ) : (
                                <div className="admin-thumb-empty"><i className="fas fa-image"></i></div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="admin-name-cell">
                              <span className="admin-name">{sample.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="admin-image-count" onClick={() => openImagesView(sample)}>
                              <i className="fas fa-images"></i> {sample.images.length}
                            </span>
                          </td>

                          <td>
                            <div className="admin-actions">
                              <button className="admin-action-btn edit" onClick={() => openEditForm(sample)} title={t.editProject || 'Edit'}>
                                <i className="fas fa-pen"></i>
                              </button>
                              <button className="admin-action-btn images" onClick={() => openImagesView(sample)} title={t.adminManageImages || 'Images'}>
                                <i className="fas fa-images"></i>
                              </button>

                              <button className="admin-action-btn delete" onClick={() => setDeleteConfirm(sample.id)} title={t.deleteProject || 'Delete'}>
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>

                            {/* Delete confirmation */}
                            {deleteConfirm === sample.id && (
                              <div className="admin-delete-confirm">
                                <p>{t.confirmDelete || 'Delete this work sample?'}</p>
                                <div className="admin-delete-actions">
                                  <button className="admin-confirm-yes" onClick={() => handleDelete(sample.id)}>
                                    <i className="fas fa-check"></i> {t.yes || 'Yes'}
                                  </button>
                                  <button className="admin-confirm-no" onClick={() => setDeleteConfirm(null)}>
                                    <i className="fas fa-times"></i> {t.no || 'No'}
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ═══ CREATE / EDIT FORM ═══ */}
          {currentView === 'form' && (
            <div className="admin-form-wrap">
              <div className="admin-form">
                <div className="admin-form-row">
                  <div className="admin-form-group full">
                    <label><i className="fas fa-heading"></i> {t.projectName || 'Project Name'} *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder={t.adminNamePlaceholder || 'Enter project name'}
                      autoFocus
                    />
                  </div>
                </div>



                <div className="admin-form-actions">
                  <button className="admin-save-btn" onClick={handleSaveForm} disabled={!formData.name.trim()}>
                    <i className="fas fa-save"></i> {formMode === 'edit' ? (t.adminUpdate || 'Update') : (t.saveProject || 'Save')}
                  </button>
                  <button className="admin-cancel-btn" onClick={() => { setCurrentView('list'); setSelectedSample(null); }}>
                    {t.cancelBtn || 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ IMAGES VIEW ═══ */}
          {currentView === 'images' && selectedSample && (
            <div className="admin-images-view">
              <div className="admin-images-header">
                <h3><i className="fas fa-images"></i> {selectedSample.name} — {selectedSample.images.length} {t.images || 'Images'}</h3>
              </div>

              {/* Upload Controls */}
              <div className="admin-images-toolbar">
                <label className="admin-upload-btn">
                  <i className="fas fa-upload"></i> {t.uploadImages || 'Upload Images'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                </label>
                {uploading && (
                  <span className="admin-uploading">
                    <i className="fas fa-spinner fa-spin"></i> Uploading...
                  </span>
                )}
                <button className="admin-url-btn" onClick={() => setShowUrlInput(!showUrlInput)}>
                  <i className="fas fa-link"></i> {t.addImageUrl || 'Add URL'}
                </button>
              </div>

              {/* URL Input */}
              {showUrlInput && (
                <div className="admin-url-input-row">
                  <input
                    type="url"
                    placeholder="https://example.com/image.png"
                    value={imageUrlInput}
                    onChange={e => setImageUrlInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddImageUrl()}
                    autoFocus
                  />
                  <button className="admin-url-add" onClick={handleAddImageUrl} disabled={!imageUrlInput.trim()}>
                    <i className="fas fa-plus"></i>
                  </button>
                  <button className="admin-url-cancel" onClick={() => { setShowUrlInput(false); setImageUrlInput(''); }}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}

              {/* Images Grid */}
              {selectedSample.images.length === 0 ? (
                <div className="admin-empty">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <p>{t.noImages || 'No images yet. Upload some!'}</p>
                </div>
              ) : (
                <div className="admin-images-grid">
                  {selectedSample.images.map((img, idx) => (
                    <div key={img.id || idx} className="admin-image-card">
                      <img src={img.url} alt={`${selectedSample.name} ${idx + 1}`} />
                      <div className="admin-image-overlay">
                        <span className="admin-image-number">#{idx + 1}</span>
                        <button
                          className="admin-image-delete"
                          onClick={() => setDeleteImageId(idx)}
                          title="Delete image"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>

                      {/* Delete image confirm */}
                      {deleteImageId === idx && (
                        <div className="admin-image-delete-confirm">
                          <p>{t.confirmDeleteImage || 'Delete this image?'}</p>
                          <div className="admin-delete-actions">
                            <button className="admin-confirm-yes" onClick={() => handleDeleteImage(idx)}>
                              <i className="fas fa-check"></i>
                            </button>
                            <button className="admin-confirm-no" onClick={() => setDeleteImageId(null)}>
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Toast ── */}
        {toast && (
          <div className={`admin-toast ${toast.type}`}>
            <i className={`fas ${toast.type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
