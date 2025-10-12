import axios from 'axios'

export async function cramerExample(id) {
  try {
    const API_URL = `http://localhost:5000/api/root-finding/cramer/${id}`
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    throw new Error('Error fetching cramer example: ' + error.message)
  }
}