import axios from "axios";

export const getSummarySent = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/summary-sent`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting images:', error);
    throw error;
  }
}
