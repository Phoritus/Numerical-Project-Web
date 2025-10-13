import axios from 'axios'

const API_URL = `http://localhost:5000/api/root-finding/`

export async function graphicalExample(id) {
  const { data } = await axios.get(`${API_URL}graphical/${id}`);
  return data;
}

export async function bisectionExample(id) {
  const { data } = await axios.get(`${API_URL}bisection/${id}`);
  return data;
}

export async function falsePositionExample(id) {
  const { data } = await axios.get(`${API_URL}false-position/${id}`);
  return data;
}

export async function newtonRaphsonExample(id) {
  const { data } = await axios.get(`${API_URL}newton-raphson/${id}`);
  return data;
}

export async function secantExample(id) {
  const { data } = await axios.get(`${API_URL}secant/${id}`);
  return data;
}

export async function onePointExample(id) {
  const { data } = await axios.get(`${API_URL}one-point/${id}`);
  return data;
}

export async function fixedPointExample(id) {
  const { data } = await axios.get(`${API_URL}fixed-point/${id}`);
  return data;
}