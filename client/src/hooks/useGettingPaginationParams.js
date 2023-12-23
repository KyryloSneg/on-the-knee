import { useEffect } from "react";
import URLActions from "../utils/URLActions";
import { useLocation } from "react-router-dom";
import useNavigateToEncodedURL from "./useNavigateToEncodedURL";

function useGettingPaginationParams(deviceStore, totalPages) {
  const location = useLocation();
  const navigate = useNavigateToEncodedURL();

  useEffect(() => {
    function getPossiblePagesToFetch(page) {
      // we are including the last page, so we are adding 1 in the end
      return totalPages - page + 1;
    }

    function replaceInvalidParams(nextPage, nextPagesToFetch) {
      const basename = process.env.REACT_APP_CLIENT_URL;
      if (+nextPage < 1 || nextPage[0] === "0") {
        nextPage = 1;
        const url = URLActions.setNewParam("page", nextPage);
        navigate(url.replace(basename, ""), { replace: true });
      } 
      
      if (+nextPage > totalPages && totalPages) {
        nextPage = totalPages;
        const url = URLActions.setNewParam("page", nextPage);
        navigate(url.replace(basename, ""), { replace: true });
      };

      const maxPagesToFetch = getPossiblePagesToFetch(nextPage);
      if (+nextPagesToFetch < 1 || nextPagesToFetch[0] === "0") {
        nextPagesToFetch = 1;
        const url = URLActions.setNewParam("pagesToFetch", nextPagesToFetch);
        navigate(url.replace(basename, ""), { replace: true });
      };
      
      if (+nextPagesToFetch > maxPagesToFetch && totalPages) {
        nextPagesToFetch = maxPagesToFetch;
        const url = URLActions.setNewParam("pagesToFetch", nextPagesToFetch);
        navigate(url.replace(basename, ""), { replace: true });
      };
    }

    let nextPage = URLActions.getParamValue("page");
    let nextPagesToFetch = URLActions.getParamValue("pagesToFetch");
    replaceInvalidParams(nextPage, nextPagesToFetch);

    deviceStore.setPage(+nextPage);
    deviceStore.setPagesToFetch(+nextPagesToFetch);
  }, [location.search, totalPages, deviceStore, navigate]);
}

export default useGettingPaginationParams;