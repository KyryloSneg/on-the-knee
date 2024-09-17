import { Navigate, Outlet } from "react-router-dom";
import { ROOT_ROUTE } from "../utils/consts";

const ProtectedRoute = ({ isAllowed, redirectPath = ROOT_ROUTE, children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute;
