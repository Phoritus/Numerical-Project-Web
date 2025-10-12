import axios from 'axios';

const API_URL = 'http://localhost:5000/api/linear-algebra';

export const cramerExample = async (id) => {
  const { data } = await axios.get(`${API_URL}/cramer/${id}`);
  return data;
};

export const gaussEliminationExample = async (id) => {
  const { data } = await axios.get(`${API_URL}/gauss-elimination/${id}`);
  return data;
};

export const gaussJordanExample = async (id) => {
  const { data } = await axios.get(`${API_URL}/gauss-jordan/${id}`);
  return data;
};

export const matrixInversionExample = async (id) => {
  const { data } = await axios.get(`${API_URL}/matrix-inversion/${id}`);
  return data;
};
