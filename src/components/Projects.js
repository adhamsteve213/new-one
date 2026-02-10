import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as db from '../dataStore';
import './Projects.css';

const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'adham2025';

const Projects = ({ language, translations }) => {
  const t = translations[language];

  /* ─── state ─── */
  const [folders, setFolders] = useState([]);           // array of folder objects
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [uploading, setUploading] = useState(false);

  // main portfolio overlay
  const [panelOpen, setPanelOpen] = useState(false);

  // create / edit folder
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [folderFormData, setFolderFormData] = useState({ name: '' });

  // open folder view (see images inside)
  const [openFolder, setOpenFolder] = useState(null);

  // add images modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // delete
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteImageIdx, setDeleteImageIdx] = useState(null);

  const multiFileRef = useRef(null);

  /* ─── Load folders + images from Appwrite ─── */
  const fetchFolders = useCallback(async () => {
    const { data, error } = await db.getFolders(true);
    if (error) {
      console.error('Error loading folders:', error);
      return;
    }
    setFolders(data || []);
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  /* ─── lock scroll ─── */
  useEffect(() => {
    document.body.style.overflow = (panelOpen || openFolder) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [panelOpen, openFolder]);

  /* ─── auth ─── */
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPassword('');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };
  const handleLogout = () => {
    setIsAdmin(false);
    setShowFolderForm(false);
    setEditingFolder(null);
  };
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleLogin(); };

  /* ─── folder CRUD (Appwrite) ─── */
  const resetFolderForm = () => {
    setFolderFormData({ name: '' });
    setEditingFolder(null);
    setShowFolderForm(false);
  };

  const handleSaveFolder = async () => {
    if (!folderFormData.name.trim()) return;

    if (editingFolder) {
      const { error } = await db.updateFolder(editingFolder.id, {
        name: folderFormData.name.trim(),
      });
      if (error) { console.error('Error updating folder:', error); return; }

      setFolders(prev => prev.map(f =>
        f.id === editingFolder.id
          ? { ...f, name: folderFormData.name.trim() }
          : f
      ));
      if (openFolder && openFolder.id === editingFolder.id) {
        setOpenFolder(prev => ({ ...prev, name: folderFormData.name.trim() }));
      }
    } else {
      const { data, error } = await db.createFolder({
        name: folderFormData.name.trim(),
      });
      if (error) { console.error('Error creating folder:', error); return; }

      setFolders(prev => [...prev, { id: data.id, name: data.name, images: [] }]);
    }
    resetFolderForm();
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setFolderFormData({ name: folder.name });
    setShowFolderForm(true);
  };

  const handleDeleteFolder = async (id) => {
    const { error } = await db.deleteFolder(id);
    if (error) { console.error('Error deleting folder:', error); return; }

    setFolders(prev => prev.filter(f => f.id !== id));
    setDeleteConfirm(null);
    if (openFolder && openFolder.id === id) setOpenFolder(null);
  };

  /* ─── image management inside a folder (Appwrite) ─── */

  // Upload files to server, saved to disk + DB
  const handleMultiFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !openFolder) return;
    setUploading(true);

    try {
      const { data: newImages, error } = await db.uploadImages(openFolder.id, files);
      if (error) { console.error('Upload error:', error); return; }

      if (newImages.length > 0) {
        setFolders(prev => prev.map(f =>
          f.id === openFolder.id ? { ...f, images: [...f.images, ...newImages] } : f
        ));
        setOpenFolder(prev => {
          if (prev && prev.id === openFolder.id) {
            return { ...prev, images: [...prev.images, ...newImages] };
          }
          return prev;
        });
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
      if (multiFileRef.current) multiFileRef.current.value = '';
    }
  };

  // Add image by external URL
  const handleAddImageUrl = async () => {
    if (!imageUrlInput.trim() || !openFolder) return;

    const { data: newImg, error } = await db.addImageUrl(
      openFolder.id,
      imageUrlInput.trim(),
      openFolder.images.length
    );
    if (error) { console.error('Error adding image URL:', error); return; }

    setFolders(prev => prev.map(f =>
      f.id === openFolder.id ? { ...f, images: [...f.images, newImg] } : f
    ));
    setOpenFolder(prev => {
      if (prev && prev.id === openFolder.id) {
        return { ...prev, images: [...prev.images, newImg] };
      }
      return prev;
    });
    setImageUrlInput('');
    setShowImageModal(false);
  };

  const handleRemoveImage = async (folderId, imgIndex) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;
    const img = folder.images[imgIndex];

    const { error } = await db.deleteImage(img.id);
    if (error) { console.error('Error deleting image:', error); return; }

    setFolders(prev => prev.map(f =>
      f.id === folderId
        ? { ...f, images: f.images.filter((_, i) => i !== imgIndex) }
        : f
    ));
    setOpenFolder(prev => {
      if (prev && prev.id === folderId) {
        return { ...prev, images: prev.images.filter((_, i) => i !== imgIndex) };
      }
      return prev;
    });
    setDeleteImageIdx(null);
  };

  /* ─── lightbox ─── */
  const openLightbox = (images, index) => {
    setLightboxImages(images.map(img => img.url));
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const nextImage = () => setLightboxIndex(i => (i + 1) % lightboxImages.length);
  const prevImage = () => setLightboxIndex(i => (i - 1 + lightboxImages.length) % lightboxImages.length);

  /* ─── open a folder ─── */
  const handleOpenFolder = (folder) => {
    setOpenFolder(folder);
  };

  // total images across all folders
  const totalImages = folders.reduce((acc, f) => acc + f.images.length, 0);

  /* ─── RENDER ─── */
  return (
    <section id="portfolio" className={`projects ${language === 'ar' ? 'rtl' : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{t.projectsTag}</span>
          <h2 className="section-title">{t.projectsTitle}</h2>
          <div className="section-line"></div>
          <p className="section-subtitle">{t.projectsSubtitle}</p>
        </div>

        {/* Cover Thumbnail Card */}
        <div className="cover-thumbnail" onClick={() => setPanelOpen(true)}>
          <div className="cover-thumb-image">
            <img src={process.env.PUBLIC_URL + "/cover.jpeg"} alt="Work Samples" />
            <div className="cover-thumb-overlay">
              <div className="cover-thumb-content">
                <div className="folder-icon-wrap">
                  <i className="fas fa-folder-open"></i>
                </div>
                <h3>{t.clickToView}</h3>
                <span className="cover-thumb-count">
                  <i className="fas fa-layer-group"></i>
                  {folders.length} {t.folders} &middot; {totalImages} {t.images}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ MAIN PANEL — Folder Grid ═══════ */}
      {panelOpen && !openFolder && (
        <div className="folder-backdrop" onClick={() => setPanelOpen(false)}>
          <div className={`folder-panel ${language === 'ar' ? 'rtl' : ''}`} onClick={e => e.stopPropagation()}>

            <div className="folder-header">
              <div className="folder-header-left">
                <i className="fas fa-folder-open folder-header-icon"></i>
                <h3>{t.projectsTitle}</h3>
              </div>
              <button className="folder-close-btn" onClick={() => setPanelOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="folder-admin-bar">
              {!isAdmin ? (
                <button className="admin-login-btn" onClick={() => setShowLoginModal(true)}>
                  <i className="fas fa-lock"></i> {t.adminLogin}
                </button>
              ) : (
                <div className="admin-controls">
                  <button className="admin-add-btn" onClick={() => { resetFolderForm(); setShowFolderForm(true); }}>
                    <i className="fas fa-plus"></i> {t.createFolder}
                  </button>
                  <button className="admin-logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> {t.adminLogout}
                  </button>
                </div>
              )}
            </div>

            <div className="folder-body">
              {folders.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-folder-open"></i>
                  <p>{t.noProjects}</p>
                </div>
              ) : (
                <div className="projects-grid">
                  {folders.map(folder => (
                    <div key={folder.id} className="folder-card">
                      {/* Thumbnail — first image or placeholder */}
                      <div className="folder-card-thumb" onClick={() => handleOpenFolder(folder)}>
                        {folder.images.length > 0 ? (
                          <>
                            <img src={folder.images[0].url} alt={folder.name} />
                            <div className="folder-card-overlay">
                              <i className="fas fa-folder-open"></i>
                              <span>{folder.images.length} {t.images}</span>
                            </div>
                          </>
                        ) : (
                          <div className="folder-card-placeholder">
                            <i className="fas fa-folder"></i>
                            <span>{t.emptyFolder}</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="folder-card-info">
                        <h3 onClick={() => handleOpenFolder(folder)}>{folder.name}</h3>
                        <div className="folder-card-actions">
                          {isAdmin && (
                            <div className="project-admin-actions">
                              <button className="edit-btn" onClick={() => handleEditFolder(folder)} title={t.editProject}>
                                <i className="fas fa-pen"></i>
                              </button>
                              <button className="delete-btn" onClick={() => setDeleteConfirm(folder.id)} title={t.deleteProject}>
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Delete Confirmation */}
                      {deleteConfirm === folder.id && (
                        <div className="delete-overlay">
                          <p>{t.confirmDelete}</p>
                          <div className="delete-actions">
                            <button className="confirm-yes" onClick={() => handleDeleteFolder(folder.id)}>{t.yes}</button>
                            <button className="confirm-no" onClick={() => setDeleteConfirm(null)}>{t.no}</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════ OPEN FOLDER — Image Gallery ═══════ */}
      {openFolder && (
        <div className="folder-backdrop" onClick={() => setOpenFolder(null)}>
          <div className={`folder-panel ${language === 'ar' ? 'rtl' : ''}`} onClick={e => e.stopPropagation()}>

            <div className="folder-header">
              <div className="folder-header-left">
                <button className="folder-back-btn" onClick={() => setOpenFolder(null)}>
                  <i className={`fas fa-arrow-${language === 'ar' ? 'right' : 'left'}`}></i>
                </button>
                <i className="fas fa-folder-open folder-header-icon"></i>
                <h3>{openFolder.name}</h3>
              </div>
              <div className="folder-header-right">
                <button className="folder-close-btn" onClick={() => { setOpenFolder(null); setPanelOpen(false); }}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* Admin tools for adding images */}
            {isAdmin && (
              <div className="folder-admin-bar">
                <div className="admin-controls">
                  <label className="admin-add-btn upload-label">
                    <i className="fas fa-upload"></i> {t.uploadImages}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={multiFileRef}
                      onChange={handleMultiFileUpload}
                      style={{ display: 'none' }}
                      disabled={uploading}
                    />
                  </label>
                  {uploading && <span className="upload-spinner"><i className="fas fa-spinner fa-spin"></i> {t.uploading}</span>}
                  <button className="admin-add-btn url-add-btn" onClick={() => { setImageUrlInput(''); setShowImageModal(true); }}>
                    <i className="fas fa-link"></i> {t.addImageUrl}
                  </button>
                </div>
              </div>
            )}

            <div className="folder-body">
              {openFolder.images.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-images"></i>
                  <p>{t.noImages}</p>
                </div>
              ) : (
                <div className="images-grid">
                  {openFolder.images.map((img, idx) => (
                    <div key={img.id || idx} className="image-card">
                      <div className="image-card-img" onClick={() => openLightbox(openFolder.images, idx)}>
                        <img src={img.url} alt={`${openFolder.name} ${idx + 1}`} />
                        <div className="image-card-overlay">
                          <i className="fas fa-search-plus"></i>
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          className="image-remove-btn"
                          onClick={() => setDeleteImageIdx(idx)}
                          title={t.deleteImage}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      )}
                      {/* Delete image confirmation */}
                      {deleteImageIdx === idx && (
                        <div className="delete-overlay image-delete-overlay">
                          <p>{t.confirmDeleteImage}</p>
                          <div className="delete-actions">
                            <button className="confirm-yes" onClick={() => handleRemoveImage(openFolder.id, idx)}>{t.yes}</button>
                            <button className="confirm-no" onClick={() => setDeleteImageIdx(null)}>{t.no}</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════ LOGIN MODAL ═══════ */}
      {showLoginModal && (
        <div className="modal-backdrop" onClick={() => { setShowLoginModal(false); setLoginError(false); setPassword(''); }}>
          <div className="modal-content login-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setShowLoginModal(false); setLoginError(false); setPassword(''); }}>
              <i className="fas fa-times"></i>
            </button>
            <h3><i className="fas fa-shield-alt"></i> {t.adminLogin}</h3>
            <input
              type="password"
              placeholder={t.enterPassword}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {loginError && <p className="error-msg">{t.wrongPassword}</p>}
            <button className="modal-submit-btn" onClick={handleLogin}>{t.loginBtn}</button>
          </div>
        </div>
      )}

      {/* ═══════ CREATE / EDIT FOLDER MODAL ═══════ */}
      {showFolderForm && (
        <div className="modal-backdrop" onClick={resetFolderForm}>
          <div className="modal-content form-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={resetFolderForm}>
              <i className="fas fa-times"></i>
            </button>
            <h3><i className="fas fa-folder-plus"></i> {editingFolder ? t.editFolder : t.createFolder}</h3>

            <div className="form-group">
              <label>{t.folderName} *</label>
              <input
                type="text"
                value={folderFormData.name}
                onChange={e => setFolderFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t.folderName}
                autoFocus
              />
            </div>

            <div className="form-actions">
              <button className="save-btn" onClick={handleSaveFolder} disabled={!folderFormData.name.trim()}>
                <i className="fas fa-save"></i> {t.saveProject}
              </button>
              <button className="cancel-btn" onClick={resetFolderForm}>
                {t.cancelBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ ADD IMAGE URL MODAL ═══════ */}
      {showImageModal && (
        <div className="modal-backdrop" onClick={() => setShowImageModal(false)}>
          <div className="modal-content login-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowImageModal(false)}>
              <i className="fas fa-times"></i>
            </button>
            <h3><i className="fas fa-link"></i> {t.addImageUrl}</h3>
            <input
              type="url"
              placeholder="https://example.com/image.png"
              value={imageUrlInput}
              onChange={e => setImageUrlInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddImageUrl(); }}
              autoFocus
            />
            <button className="modal-submit-btn" onClick={handleAddImageUrl} disabled={!imageUrlInput.trim()}>
              <i className="fas fa-plus"></i> {t.addImage}
            </button>
          </div>
        </div>
      )}

      {/* ═══════ LIGHTBOX ═══════ */}
      {lightboxOpen && lightboxImages.length > 0 && (
        <div className="gallery-modal" onClick={() => setLightboxOpen(false)}>
          <div className="gallery-content" onClick={e => e.stopPropagation()}>
            <button className="gallery-close" onClick={() => setLightboxOpen(false)}>
              <i className="fas fa-times"></i>
            </button>

            {lightboxImages.length > 1 && (
              <button className="gallery-nav gallery-prev" onClick={prevImage}>
                <i className="fas fa-chevron-left"></i>
              </button>
            )}

            <div className="gallery-image-container">
              <img src={lightboxImages[lightboxIndex]} alt={`${lightboxIndex + 1}`} />
            </div>

            {lightboxImages.length > 1 && (
              <button className="gallery-nav gallery-next" onClick={nextImage}>
                <i className="fas fa-chevron-right"></i>
              </button>
            )}

            <div className="gallery-counter">
              {lightboxIndex + 1} / {lightboxImages.length}
            </div>
          </div>
        </div>
      )}

      <div className="section-number">04</div>
    </section>
  );
};

export default Projects;
