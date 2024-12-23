'use client';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from 'entities';
import { auth } from '@/firebase/firebaseConfig';
import { setUserContext, USER_CONTEXT_STORAGE_KEY } from '@/store/reducers/user-context';
import storageService from '@/lib/storage-service';
import { useDispatch } from 'react-redux';
import { registerUser } from '@/apis/auth';

function Register() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if(password !== confirmPassword) {
        setError('Confirm password do not match');
        return;
      }

      setLoading(true);

      const response = await createUserWithEmailAndPassword(auth, email, password);
      const user: User = {
        id: response.user.uid,
        email: response.user.email as string,
        name: response.user.displayName || '',
        age: 0,
      }
      await registerUser(user.id, email);
      const accessToken = await response.user.getIdToken();
      const refreshToken = response.user.refreshToken;
      await storageService('local').setObject(USER_CONTEXT_STORAGE_KEY, {
        accessToken,
        refreshToken,
      });
      setError(null);
      dispatch(setUserContext(user));
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', padding: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
        Register
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
      <TextField
        label="Confirm password"
        type="password"
        fullWidth
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
        Register
      </Button>

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1">
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            justifyContent: 'center',
          }}>
          Already have an account?
          <Link href="/login">
            <Typography sx={{ fontWeight: 'bold' }}>Login</Typography>
          </Link>
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}

export default Register;
