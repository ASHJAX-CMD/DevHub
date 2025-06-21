import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("You are not authorized to view this page. Please log in.");
      navigate("/");
    }
  }, [token, navigate]);

  // Return children if token exists, otherwise render nothing (redirect will happen)
  return token ? children : null;
}

export default ProtectedRoutes;
