import axios from "axios";

export const uploadImages = async (payload) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload/images`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch
    (error) {
    console.error('Error sending mail:', error);
    throw error;
  }
}
export const getImages = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/upload/images`, {
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

export const uploadImportRecipient = async (payload) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/imports`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.data;
  }catch (e){
    console.error('Error:', e);
    throw e;
  }
}