import { useEffect } from "react";
import useNavigateToEncodedURL from "./useNavigateToEncodedURL";
import URLActions from "../utils/URLActions";

function useDeletingRedundantCategoryId(type) {
  const navigate = useNavigateToEncodedURL();

  useEffect(() => {
    if (type === "category") {
      const categoryIdParam = URLActions.getParamValue("categoryId");
      if (categoryIdParam !== null) {
        const nextUrl = URLActions.deleteParamValue("categoryId", categoryIdParam);
        const basename = process.env.REACT_APP_CLIENT_URL;

        navigate(nextUrl.replaceAll(basename, ""), { preventScrollReset: true });
      }
    }
  }, [type, navigate]);

}

export default useDeletingRedundantCategoryId;