/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { updateCurrentUser } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { User } from '@/lib/entities/user';
import storageService from '@/lib/storage-service';
import { USER_CONTEXT_STORAGE_KEY } from '@/store/reducers/user-context';

const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_BE_BASE_URL}/auth` });

export const getAccessToken = () => {
  return storageService('local').getObject<{ accessToken: string, refreshToken: string }>(USER_CONTEXT_STORAGE_KEY)?.accessToken;
}

export const verifyToken = async (token: string) => {
  return api.post(`/verify`, { token });
};

export type RefreshTokenResult = {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const registerUser = async (id: string, email: string) => {
  return api.post(`/register`, { id, email });
}

export const refreshAccessToken = async (refreshToken: string): Promise<RefreshTokenResult | null> => {
  try {
    
    // Request a new token using the REST API
    const response = await axios.post(`https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const { id_token: accessToken, refresh_token } = response.data;

    const currentUser = auth.currentUser;
    if(!currentUser) {
    // Sync the new token with Firebase Auth
      await syncCurrentUser(accessToken);
    }
    if(!currentUser) {
      throw new Error('No current user');
    }

    const user: User = {
      id: currentUser.uid,
      email: currentUser.email as string,
      name: currentUser.displayName || '',
      age: 0,
    }

    return {
      accessToken, 
      refreshToken: refresh_token,
      user,
    }
  } catch (error) {
    console.error('Error refreshing token:', error);

    return null;
  }
}

async function syncCurrentUser(idToken: string) {
  // Get user details using the refreshed token
  const userDetailsResponse = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`, {
    idToken: idToken,
  });

  const userDetails = userDetailsResponse.data.users[0];

  // Update currentUser in Firebase Auth
  const newUser: any = {
    ...auth.currentUser,
    uid: userDetails.localId,
    email: userDetails.email,
    emailVerified: userDetails.emailVerified,
    displayName: userDetails.displayName,
    photoURL: userDetails.photoUrl,
    phoneNumber: userDetails.phoneNumber,
    providerData: userDetails.providerUserInfo,
    stsTokenManager: {
      accessToken: idToken,
      refreshToken: localStorage.getItem('refreshToken'),
    },
  };

  await updateCurrentUser(auth, newUser);
}