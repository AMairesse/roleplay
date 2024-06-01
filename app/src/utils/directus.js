import axios from 'axios';

const directus = axios.create({
  baseURL: process.env.API_URL,
});

export const login = async (email, password) => {
  const response = await directus.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email, password) => {
  const response = await directus.post('/users', { email, password });
  return response.data;
};

export const getWorlds = async (token) => {
  const response = await directus.get('/items/worlds', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

export const createWorld = async (token, project) => {
  const response = await directus.post('/items/worlds', project, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
