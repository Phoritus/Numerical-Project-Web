import axios from 'axios'

export async function graphicalExample(id) {
  try {
    const API_URL = `http://localhost:5000/api/root-finding/graphical/${id}`
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    throw new Error('Error fetching graphical example: ' + error.message)
  }
}