import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "../features/auth/authSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      dispatch(logout());
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    dispatch(logout());
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
