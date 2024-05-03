import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function useScrollingToPagesTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
}

export default useScrollingToPagesTop;