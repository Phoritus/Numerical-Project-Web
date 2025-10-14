import axios from 'axios';

const base = import.meta.env?.VITE_API_URL;
if (!base) {
  throw new Error('VITE_API_URL is required but not set');
}
const API_BASE = base.replace(/\/$/, '');
const API_URL = `${API_BASE}/api/linear-algebra`;

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

export const luDecompositionExample = async (id) => {
  const { data } = await axios.get(`${API_URL}/lu-decomposition/${id}`);
  return data;
};

export const choleskyExample = async (id) => {
  const { data } = await axios.get(`${API_URL}/cholesky-decomposition/${id}`);
  return data;
};

export const jacobiExample = async (id) => {
  const { data } = await axios.get(`${API_URL}/jacobi-iteration/${id}`);
  return data;
};

export const gaussSeidelExample = async (id) => {
  const { data } = await axios.get(`${API_URL}/gauss-seidel/${id}`);
  return data;
};

export const conjugateGradientExample = async (id) => {
  const { data } = await axios.get(`${API_URL}/conjugate-gradient/${id}`);
  return data;
};