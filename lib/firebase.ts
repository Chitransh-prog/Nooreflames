import type { FirebaseApp } from 'firebase/app';
import type { Auth, User as FirebaseUser } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check whether Firebase credentials have been configured in environment
export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;

// Helper to safely load firebase client-side only
async function getFirebaseClient() {
  if (typeof window === 'undefined' || !isFirebaseConfigured) {
    return null;
  }
  if (!authInstance) {
    try {
      const { initializeApp, getApps, getApp } = await import('firebase/app');
      const { getAuth } = await import('firebase/auth');
      appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      authInstance = getAuth(appInstance);
    } catch (err) {
      console.warn('[Firebase] Initialization error:', err);
      return null;
    }
  }
  return { app: appInstance, auth: authInstance };
}

// Client-safe exported dummy auth proxy so `if (isFirebaseConfigured && auth)` evaluates cleanly
const authProxy: any =
  typeof window !== 'undefined' && isFirebaseConfigured
    ? { isConfigured: true }
    : null;

export const onAuthStateChanged = (
  _auth: any,
  callback: (user: FirebaseUser | null) => void
) => {
  let unsubscribe = () => {};
  if (typeof window !== 'undefined' && isFirebaseConfigured) {
    import('firebase/auth')
      .then(async ({ onAuthStateChanged: onAuth }) => {
        const client = await getFirebaseClient();
        if (client?.auth) {
          unsubscribe = onAuth(client.auth, callback);
        }
      })
      .catch((err) => {
        console.warn('[Firebase] onAuthStateChanged failed to load:', err);
      });
  }
  return () => {
    unsubscribe();
  };
};

export const signInWithEmailAndPassword = async (
  _auth: any,
  email: string,
  pass: string
) => {
  const { signInWithEmailAndPassword: signIn } = await import('firebase/auth');
  const client = await getFirebaseClient();
  if (!client?.auth) throw new Error('Firebase Auth not available');
  return signIn(client.auth, email, pass);
};

export const createUserWithEmailAndPassword = async (
  _auth: any,
  email: string,
  pass: string
) => {
  const { createUserWithEmailAndPassword: createUser } = await import('firebase/auth');
  const client = await getFirebaseClient();
  if (!client?.auth) throw new Error('Firebase Auth not available');
  return createUser(client.auth, email, pass);
};

export const updateProfile = async (
  user: any,
  profile: { displayName?: string; photoURL?: string }
) => {
  const { updateProfile: update } = await import('firebase/auth');
  return update(user, profile);
};

export const signOut = async (_auth: any) => {
  const { signOut: logOut } = await import('firebase/auth');
  const client = await getFirebaseClient();
  if (!client?.auth) return;
  return logOut(client.auth);
};

export { appInstance as app, authProxy as auth };
export type { FirebaseUser };
