/*  ─────────────────────────────────────────────────
    Appwrite Setup Script
    Run ONCE:  node appwrite-setup.js
    Creates database, collections, attributes, and storage bucket
    ───────────────────────────────────────────────── */

const sdk = require('node-appwrite');

const ENDPOINT   = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '698938440002ec765bee';

// ⚠️  Paste your Appwrite API Key below (create one in Console → Settings → API Keys)
// Give it permissions: databases.*, collections.*, attributes.*, storage.*
const API_KEY = process.env.APPWRITE_API_KEY || 'YOUR_API_KEY_HERE';

const DATABASE_ID   = 'portfolio_db';
const FOLDERS_COL   = 'folders';
const IMAGES_COL    = 'images';
const BUCKET_ID     = 'project-images';

const client = new sdk.Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const db      = new sdk.Databases(client);
const stor    = new sdk.Storage(client);

async function setup() {
  console.log('🚀 Starting Appwrite setup...\n');

  /* ── 1. Database ── */
  try {
    await db.create(DATABASE_ID, 'Portfolio');
    console.log('✅ Database "portfolio_db" created');
  } catch (e) {
    if (e.code === 409) console.log('⚠️  Database already exists');
    else throw e;
  }

  /* ── 2. Folders collection ── */
  try {
    await db.createCollection(DATABASE_ID, FOLDERS_COL, 'Folders', [
      sdk.Permission.read(sdk.Role.any()),
      sdk.Permission.create(sdk.Role.any()),
      sdk.Permission.update(sdk.Role.any()),
      sdk.Permission.delete(sdk.Role.any()),
    ]);
    console.log('✅ Collection "folders" created');
  } catch (e) {
    if (e.code === 409) console.log('⚠️  Folders collection already exists');
    else throw e;
  }

  // Folder attributes — only 'name'
  try {
    await db.createStringAttribute(DATABASE_ID, FOLDERS_COL, 'name', 500, true);
    console.log('  ✅ Attribute folders.name');
  } catch (e) {
    if (e.code === 409) console.log('  ⚠️  folders.name already exists');
    else console.error('  ❌ folders.name:', e.message);
  }

  /* ── 3. Images collection ── */
  try {
    await db.createCollection(DATABASE_ID, IMAGES_COL, 'Images', [
      sdk.Permission.read(sdk.Role.any()),
      sdk.Permission.create(sdk.Role.any()),
      sdk.Permission.update(sdk.Role.any()),
      sdk.Permission.delete(sdk.Role.any()),
    ]);
    console.log('✅ Collection "images" created');
  } catch (e) {
    if (e.code === 409) console.log('⚠️  Images collection already exists');
    else throw e;
  }

  const imageAttrs = [
    { key: 'folder_id',    size: 100,  required: true  },
    { key: 'image_url',    size: 5000, required: true  },
    { key: 'storage_path', size: 500,  required: false },
  ];

  for (const attr of imageAttrs) {
    try {
      await db.createStringAttribute(DATABASE_ID, IMAGES_COL, attr.key, attr.size, attr.required, attr.required ? undefined : '');
      console.log(`  ✅ Attribute images.${attr.key}`);
    } catch (e) {
      if (e.code === 409) console.log(`  ⚠️  images.${attr.key} already exists`);
      else console.error(`  ❌ images.${attr.key}:`, e.message);
    }
  }

  // position integer
  try {
    await db.createIntegerAttribute(DATABASE_ID, IMAGES_COL, 'position', false, 0, 0, 10000);
    console.log('  ✅ Attribute images.position');
  } catch (e) {
    if (e.code === 409) console.log('  ⚠️  images.position already exists');
    else console.error('  ❌ images.position:', e.message);
  }

  /* ── 4. Storage bucket ── */
  try {
    await stor.createBucket(BUCKET_ID, 'Project Images', [
      sdk.Permission.read(sdk.Role.any()),
      sdk.Permission.create(sdk.Role.any()),
      sdk.Permission.update(sdk.Role.any()),
      sdk.Permission.delete(sdk.Role.any()),
    ], false, true, undefined, ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'], undefined, undefined, undefined, 10485760);
    console.log('✅ Storage bucket "project-images" created');
  } catch (e) {
    if (e.code === 409) console.log('⚠️  Bucket already exists');
    else console.error('❌ Bucket error:', e.message);
  }

  console.log('\n🎉 Setup complete! Your .env IDs are already correct.');
  console.log('   DATABASE_ID  = portfolio_db');
  console.log('   FOLDERS_COL  = folders');
  console.log('   IMAGES_COL   = images');
  console.log('   BUCKET_ID    = project-images');
}

setup().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
