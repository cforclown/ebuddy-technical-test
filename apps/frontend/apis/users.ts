import axios from 'axios';
import { getAccessToken } from './auth';

const api = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_BE_BASE_URL}/api/users` });

export const fetchUserData = async (id: string) => {
  return api.get(`/fetch-user-data/${id}`, {
    headers: {
      Authorization: getAccessToken(),
    }
  });
};

export const updateUserData = async (data: object) => {
  return api.put('/update-user-data', data, {
    headers: {
      Authorization: getAccessToken(),
    }
  });
};
