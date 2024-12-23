'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import Main from '@/components/pages/main';
import { useAppDispatch, useAppSelector } from '@/lib/states.hooks';
import storageService from '@/lib/storage-service';
import { setUserContext, USER_CONTEXT_STORAGE_KEY } from '@/store/reducers/user-context';
import { User } from '@/lib/entities/user';
import { refreshAccessToken, verifyToken } from '@/apis/auth';

function MainPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(true);
  const userContext = useAppSelector((state) => state.userContext.user);

  const validateSavedUserContext = async (): Promise<void> => {
    setLoading(true);
    try {
      const savedTokens = storageService('local').getObject<{ accessToken: string, refreshToken: string }>(USER_CONTEXT_STORAGE_KEY);
      if (!savedTokens) {
        return router.push('/login');
      }
      let { accessToken, refreshToken } = savedTokens;
      let user: User | undefined;
      try {
        const response = await verifyToken(accessToken);
        user = {
          id: response.data.data.uid,
          email: response.data.data.email as string,
          name: response.data.data.displayName || '',
          age: 0,
        }
      } catch (err) {
        if(err instanceof AxiosError && err.response?.status === 401) {
          const response = await refreshAccessToken(refreshToken);
          if(!response) {
            return router.push('/login');
          }

          user = response.user;
          accessToken = response.accessToken;
          refreshToken = response.refreshToken;
        } else {
          console.error('Error validating saved user context', err);
          return router.push('/login');
        }
      }

      dispatch(setUserContext(user));
      storageService('local').setObject(USER_CONTEXT_STORAGE_KEY, {
        accessToken,
        refreshToken,
      });
    } catch (err) {
      console.error('Error validating saved user context', err);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userContext) {
      setLoading(false);
      return;
    }

    validateSavedUserContext();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(loading || !userContext) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Loading...
        </Typography>
      </Box>
    )
  }

  return (
    <Main user={userContext} />
  );
}

export default MainPage;
