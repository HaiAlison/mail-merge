import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Cài đặt bằng `npm install jwt-decode`

export const useToken = (storageKey = 'token') => {
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(storageKey); // Hoặc sessionStorage
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode token
        setTokenData(decoded); // Lưu thông tin token
      } catch (error) {
        console.error('Invalid token:', error);
        setTokenData(null);
      }
    }
  }, [storageKey]);

  return tokenData; // Trả về dữ liệu đã decode
};