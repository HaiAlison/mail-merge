import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
  const navigate = useNavigate();
  useEffect(
    () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Điều hướng đến /login nếu không có token
      }
    }, [navigate]);

  return children; // Render children nếu có token
};
export default ProtectedRoute;