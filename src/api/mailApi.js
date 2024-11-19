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