import axios from 'axios'

const base = import.meta.env?.VITE_API_URL;
if (!base) {
  throw new Error('VITE_API_URL is required but not set');
}
const API_BASE = base.replace(/\/$/, '');
const API_URL = `${API_BASE}/api/root-finding`;

export async function graphicalExample(id) {
  const { data } = await axios.get(`${API_URL}/graphical/${id}`);
  return data;
}

export async function bisectionExample(id) {
  const { data } = await axios.get(`${API_URL}/bisection/${id}`);
  return data;
}

export async function falsePositionExample(id) {
  const { data } = await axios.get(`${API_URL}/false-position/${id}`);
  return data;
}

export async function newtonRaphsonExample(id) {
  const { data } = await axios.get(`${API_URL}/newton-raphson/${id}`);
  return data;
}

export async function secantExample(id) {
  const { data } = await axios.get(`${API_URL}/secant/${id}`);
  return data;
}

export async function onePointExample(id) {
  const { data } = await axios.get(`${API_URL}/one-point/${id}`);
  return data;
}

export async function fixedPointExample(id) {
  const { data } = await axios.get(`${API_URL}/fixed-point/${id}`);
  return data;
}