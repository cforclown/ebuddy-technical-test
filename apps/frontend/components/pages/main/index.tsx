'use client'

import React, { useCallback, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { fetchUser } from '@/store/reducers/users.api/actions';
import UpdateButton from '@/components/UpdateBtn';
import { useAppDispatch, useAppSelector } from '@/lib/states.hooks';
import { User } from '@/lib/entities/user';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { getAccessToken } from '@/apis/auth';

type MainPageProps = {
  user: User;
};

function Main({ user: currentUserLogin }: MainPageProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: user, loading, error } = useAppSelector((state) => state.users);

  const [userIdInput, setUserIdInput] = React.useState('');
  const [nameInput, setNameInput] = React.useState('');
  const [emailInput, setEmailInput] = React.useState('');
  const [ageInput, setAgeInput] = React.useState<number | undefined>(0);
  const [inputError, setInputError] = React.useState<string | null>(null);

  useEffect(() => {
    if(!user) {
      return;
    }

    setEmailInput(user.email);
    setNameInput(user.name ?? '');
    setAgeInput(user.age ?? 0);
  }, [user]);

  const onFetchUserData = useCallback((userId: string) => {
    if(!userId) {
      setInputError('User ID is empty');
      return;
    }
    
    if(userId===currentUserLogin.id) {
      setUserIdInput(userId);
    }
    dispatch(fetchUser(userId));
  }, [currentUserLogin.id, dispatch]);

  const onLogout = useCallback(async () => {
    const accessToken = getAccessToken();
    if(accessToken) {
      await signOut(auth);
    }
    router.push('/login')
  }, [router]);

  return (
    <Box 
      sx={{ 
        maxWidth: 600, 
        margin: 'auto', 
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 4,
    }}
    >
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          EBUDDY
        </Typography>
        <Typography variant="h4" gutterBottom>
          Technical test solution
        </Typography>
      </Box>

      <Box 
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Current user login
        </Typography>
        <TextField
          label="Search User ID"
          type="text"
          fullWidth
          margin="normal"
          value={currentUserLogin.id}
          disabled
        />
        <Box sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <Button 
            variant="contained" 
            onClick={() => onFetchUserData(currentUserLogin.id)} 
            disabled={loading}
          >
            Fetch your data
          </Button>
          <Button 
            variant="contained" 
            color="warning"
            onClick={onLogout} 
            disabled={loading}
          >
            Logout
          </Button>
        </Box>
      </Box>
      
      {loading && <Typography>Loading...</Typography>}
      {(error || inputError) && (
        <Typography color="error" variant="body2">
          {error || inputError}
        </Typography>
      )}

      <Box>
        <TextField
          label="User ID"
          type="text"
          fullWidth
          margin="normal"
          value={userIdInput}
          onChange={(e) => { console.log(e.target.value); setUserIdInput(e.target.value) }}
        />

        <Button 
          variant="contained" 
          onClick={() => onFetchUserData(userIdInput)} 
          disabled={loading}
        >
          Fetch User Data
        </Button>

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={emailInput}
          disabled
        />
        <TextField
          label="Name"
          type="text"
          fullWidth
          margin="normal"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <TextField
          label="Age"
          type="number"
          fullWidth
          margin="normal"
          value={ageInput}
          onChange={(e) => setAgeInput(Number(e.target.value))}
        />
        <UpdateButton
          userId={userIdInput}
          email={emailInput}
          name={nameInput}
          age={ageInput}
          disabled={loading}
        />
      </Box>
    </Box>
  );
}

export default Main;
