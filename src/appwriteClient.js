import { Client, Account, Databases, Storage, ID, Query, Permission, Role } from 'appwrite';

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("698938440002ec765bee");

const account = new Account(client);
const databases = new Databases(client);
const storage   = new Storage(client);

export const DATABASE_ID   = process.env.REACT_APP_APPWRITE_DATABASE_ID   || 'portfolio_db';
export const FOLDERS_COL   = process.env.REACT_APP_APPWRITE_FOLDERS_COLLECTION_ID || 'folders';
export const IMAGES_COL    = process.env.REACT_APP_APPWRITE_IMAGES_COLLECTION_ID  || 'images';
export const BUCKET_ID     = process.env.REACT_APP_APPWRITE_BUCKET_ID     || 'project-images';

export { client, account, databases, storage, ID, Query, Permission, Role };
