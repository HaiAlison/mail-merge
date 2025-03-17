import axios from "axios";

export const sendMail = async (mailData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/mail/send`, mailData);
    return response.data;
  } catch (error) {
    console.error('Error sending mail:', error);
    throw error;
  }
};

export const createRecipient = async (recipient) => {
  try {
    const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/recipient/create-recipient`, recipient, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return data;
  } catch (e) {
    console.error('Error creating recipient:', e);
    throw e;
  }
}

export const getRecipients = async (limit, offset) => {
  try {
    const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/recipient?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return data;
  } catch (e) {
    console.error('Error getting recipients:', e);
    throw e;
  }
}
export const deleteRecipient = async (id) => {
  try {
    const {data} = await axios.delete(`${process.env.REACT_APP_API_URL}/recipient/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return data;
  } catch (e) {
    console.error('Error deleting recipient:', e);
    throw e;
  }
}