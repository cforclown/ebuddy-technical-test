import admin from 'firebase-admin';
import * as dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FB_PROJECT_ID,
    privateKey: process.env.FB_PRIVATE_KEY,
    clientEmail: process.env.FB_CLIENT_EMAIL,
  }),
});

export default admin;

export const db = admin.firestore();
