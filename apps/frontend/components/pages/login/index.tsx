/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button, TextField, Box, Typography } from '@mui/material';
import { auth } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import storageService from '@/lib/storage-service';
import { User } from '@/lib/entities/user';
import { setUserContext, USER_CONTEXT_STORAGE_KEY } from '@/store/reducers/user-context';
import { useDispatch } from 'react-redux';

function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await signInWithEmailAndPassword(auth, email, password);
      setError(null);
      const user: User = {
        id: response.user.uid,
        email: response.user.email as string,
        name: response.user.displayName || '',
        age: 0,
      }
      const accessToken = await response.user.getIdToken();
      const refreshToken = response.user.refreshToken;
      await storageService('local').setObject(USER_CONTEXT_STORAGE_KEY, {
        accessToken,
        refreshToken,
      });
      dispatch(setUserContext(user));
      router.push('/');
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 4 }}>
      <Typography variant="h5" gutterBottom textAlign="center" fontWeight="bold">
        Login
      </Typography>

      {error && (
        <Typography color="error" variant="body2" textAlign="center">
          {error}
        </Typography>
      )}

      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        Login
      </Button>

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1">
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            justifyContent: 'center',
          }}>
          Dont&apos;t have an account?
          <Link href="/register">
            <Typography sx={{ fontWeight: 'bold' }}>Register</Typography>
          </Link>
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;
