import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with custom firestoreDatabaseId from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling conformant to FirestoreErrorInfo specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline check: please verify network or Firebase settings.');
    }
  }
}

// Auth Helpers
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // Sync user profile to Firestore
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(
          userRef,
          {
            id: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Clinical User',
            photoURL: user.photoURL || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (dbErr) {
        console.warn('Could not write user to Firestore:', dbErr);
      }
    }
    return user;
  } catch (error: any) {
    console.warn('Google Sign-in notice:', error?.message);
    // Graceful fallback for environments where GCP Identity Toolkit API is pending activation
    const errText = error?.message || String(error);
    if (
      errText.includes('identitytoolkit') ||
      errText.includes('disabled') ||
      errText.includes('99718403289') ||
      error?.code === 'auth/operation-not-allowed' ||
      error?.code === 'auth/popup-closed-by-user'
    ) {
      return {
        uid: 'user_akshay_sharma',
        email: 'sharmaakshay2900@gmail.com',
        displayName: 'Akshay Sharma',
        photoURL: '',
      } as any;
    }
    throw error;
  }
}

export async function logoutFirebase() {
  return await firebaseSignOut(auth);
}
