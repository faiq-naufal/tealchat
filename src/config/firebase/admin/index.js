import * as firebaseAdmin from "firebase-admin";

const firebaseAdminConfig = {
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
    privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
  }),
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp(firebaseAdminConfig);
}

export { firebaseAdmin };
