/*  ─────────────────────────────────────────────────
    dataStore.js  –  Appwrite-powered data store
    No backend server needed. Deploys on Netlify.
    ───────────────────────────────────────────────── */

import {
  databases, storage,
  DATABASE_ID, FOLDERS_COL, IMAGES_COL, BUCKET_ID,
  ID, Query, Permission, Role,
} from './appwriteClient';

/* ══════════════════════════════════════════
   FOLDERS
   ══════════════════════════════════════════ */

export const getFolders = async (ascending = true) => {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      FOLDERS_COL,
      [
        ascending ? Query.orderAsc('$createdAt') : Query.orderDesc('$createdAt'),
        Query.limit(100),
      ]
    );

    // fetch all images once
    const imgRes = await databases.listDocuments(
      DATABASE_ID,
      IMAGES_COL,
      [Query.orderAsc('$createdAt'), Query.limit(500)]
    );

    const folders = res.documents.map(f => ({
      id: f.$id,
      name: f.name,
      created_at: f.$createdAt,
      images: imgRes.documents
        .filter(img => img.folder_id === f.$id)
        .map(img => ({
          id: img.$id,
          url: img.image_url,
          storagePath: img.storage_path || null,
        })),
    }));

    return { data: folders, error: null };
  } catch (err) {
    console.error('getFolders error:', err);
    return { data: [], error: err };
  }
};

export const createFolder = async (payload) => {
  try {
    const doc = await databases.createDocument(
      DATABASE_ID,
      FOLDERS_COL,
      ID.unique(),
      {
        name: payload.name || '',
      },
      [
        Permission.read(Role.any()),
        Permission.write(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ]
    );

    return {
      data: {
        id: doc.$id,
        name: doc.name,
        created_at: doc.$createdAt,
        images: [],
      },
      error: null,
    };
  } catch (err) {
    console.error('createFolder error:', err);
    return { data: null, error: err };
  }
};

export const updateFolder = async (id, payload) => {
  try {
    const doc = await databases.updateDocument(
      DATABASE_ID,
      FOLDERS_COL,
      id,
      payload
    );
    return { data: { id: doc.$id, ...doc }, error: null };
  } catch (err) {
    console.error('updateFolder error:', err);
    return { data: null, error: err };
  }
};

export const deleteFolder = async (id) => {
  try {
    // delete all images belonging to this folder
    const imgRes = await databases.listDocuments(
      DATABASE_ID,
      IMAGES_COL,
      [Query.equal('folder_id', id), Query.limit(500)]
    );
    for (const img of imgRes.documents) {
      // delete from storage if uploaded
      if (img.storage_path) {
        try { await storage.deleteFile(BUCKET_ID, img.storage_path); } catch {}
      }
      await databases.deleteDocument(
        DATABASE_ID,
        IMAGES_COL,
        img.$id
      );
    }
    // delete folder
    await databases.deleteDocument(
      DATABASE_ID,
      FOLDERS_COL,
      id
    );
    return { error: null };
  } catch (err) {
    console.error('deleteFolder error:', err);
    return { error: err };
  }
};

/* ══════════════════════════════════════════
   IMAGES
   ══════════════════════════════════════════ */

export const uploadImages = async (folderId, files) => {
  try {
    const existingRes = await databases.listDocuments(
      DATABASE_ID,
      IMAGES_COL,
      [Query.equal('folder_id', folderId), Query.limit(500)]
    );
    const currentCount = existingRes.total;
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // upload to Appwrite Storage
      const uploaded = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file,
        [Permission.read(Role.any())]
      );

      // get the public view URL
      const viewUrl = storage.getFileView(
        BUCKET_ID,
        uploaded.$id
      );

      // save reference in database
      const doc = await databases.createDocument(
        DATABASE_ID,
        IMAGES_COL,
        ID.unique(),
        {
          folder_id: folderId,
          image_url: viewUrl,
          storage_path: uploaded.$id,
        },
        [
          Permission.read(Role.any()),
          Permission.write(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
        ]
      );

      newImages.push({ id: doc.$id, url: viewUrl, storagePath: uploaded.$id });
    }

    return { data: newImages, error: null };
  } catch (err) {
    console.error('uploadImages error:', err);
    return { data: [], error: err };
  }
};

export const addImageUrl = async (folderId, imageUrl, position = 0) => {
  try {
    const doc = await databases.createDocument(
      DATABASE_ID,
      IMAGES_COL,
      ID.unique(),
      {
        folder_id: folderId,
        image_url: imageUrl,
        storage_path: null,
      },
      [
        Permission.read(Role.any()),
        Permission.write(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ]
    );
    return { data: { id: doc.$id, url: imageUrl, storagePath: null }, error: null };
  } catch (err) {
    console.error('addImageUrl error:', err);
    return { data: null, error: err };
  }
};

export const deleteImage = async (imageId) => {
  try {
    // get the image doc to check for storage file
    const doc = await databases.getDocument(
      DATABASE_ID,
      IMAGES_COL,
      imageId
    );
    // delete from storage if uploaded
    if (doc.storage_path) {
      try { await storage.deleteFile(BUCKET_ID, doc.storage_path); } catch {}
    }
    // delete the document
    await databases.deleteDocument(
      DATABASE_ID,
      IMAGES_COL,
      imageId
    );
    return { error: null };
  } catch (err) {
    console.error('deleteImage error:', err);
    return { error: err };
  }
};
