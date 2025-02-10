import axios from 'axios';
import { FORBIDDEN, FORBIDDEN_MESSAGE } from './errors';

export interface User {
  id: string;
  name: string;
  email: string;
}

const api = 'http://localhost:8080/api';

export const verifyToken = async (): Promise<User> => {
  try {
    const response = await axios.get<{ user: User }>(`${api}/verify-token`, {
      withCredentials: true,
    });

    return response.data.user;
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      if (error.status === FORBIDDEN) {
        throw new Error(FORBIDDEN_MESSAGE);
      }
    }

    throw new Error('Error verifying token');
  }
};
