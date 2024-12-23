/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from 'entities';
import { fetchUserData, updateUserData } from '@/apis/users';

// Async action to fetch user data
export const fetchUser = createAsyncThunk(
  'users/fetch',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response =  await fetchUserData(userId);
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.message);
    }
  }
);

// Async action to update user data
export const updateUser = createAsyncThunk(
  'users/update',
  async (data: { payload: User }, { rejectWithValue }) => {
    try {
      const response = await updateUserData(data.payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.message);
    }
  }
);
