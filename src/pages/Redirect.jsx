import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { notification } from "antd";

const Redirect = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token')
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      notification.success({
        message: 'Login Successful',
        description: 'You have successfully logged in.',
      });
      window.location.href = '/';
    }
  }, [token]);

  return (
    <div>
      Loading...
    </div>
  );
}
export default Redirect;