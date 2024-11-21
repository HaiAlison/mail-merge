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

export const createSender = async (sender) => {
  try {
    const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/sender/create-sender`, sender, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return data;
  } catch (e) {
    console.error('Error creating sender:', e);
    throw e;
  }
}

export const getSenders = async (limit, offset) => {
  try {
    const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/sender?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return data;
  } catch (e) {
    console.error('Error getting senders:', e);
    throw e;
  }
}
export const deleteSender = async (id) => {
  try {
    const {data} = await axios.delete(`${process.env.REACT_APP_API_URL}/sender/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return data;
  } catch (e) {
    console.error('Error deleting sender:', e);
    throw e;
  }
}