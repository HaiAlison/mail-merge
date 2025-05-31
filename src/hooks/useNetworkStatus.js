import { useState, useEffect } from 'react';
import axios from 'axios';

const useNetworkStatus = (backendUrl) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isBackendOnline, setIsBackendOnline] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const checkBackendStatus = async () => {
      try {
        await axios.get(backendUrl);
        setIsBackendOnline(true);
      } catch (error) {
        setIsBackendOnline(false);
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    const intervalId = setInterval(checkBackendStatus, 10000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(intervalId);
    };
  }, [backendUrl]);

  return { isOnline, isBackendOnline };
};

export default useNetworkStatus;