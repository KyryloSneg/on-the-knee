import { useEffect } from "react";
import URLActions from "../utils/URLActions";
import { useLocation } from "react-router-dom";
import useNavigateToEncodedURL from "./useNavigateToEncodedURL";
import { CLIENT_URL } from "utils/consts";

function useGettingPaginationParams(storeWithPagination, totalPages) {
  const location = useLocation();
  const navigate = useNavigateToEncodedURL();

  useEffect(() => {
    function getPossiblePagesToFetch(page) {
      // we are including the last page, so we are adding 1 in the end
      return totalPages - page + 1;
    }

    function replaceInvalidParams(nextPage, nextPagesToFetch) {
      let url;
      const basename = CLIENT_URL;
      
      if (isNaN(+nextPage)) {
        nextPage = 1;
        url = URLActions.setNewParam("page", nextPage);
      }

      if (+nextPage < 1 || nextPage[0] === "0") {
        nextPage = 1;
        url = URLActions.setNewParam("page", nextPage);
      } 
      
      if (+nextPage > totalPages && totalPages) {
        nextPage = totalPages;
        url = URLActions.setNewParam("page", nextPage);
      };

      if (isNaN(+nextPagesToFetch)) {
        nextPagesToFetch = 1;
        url = URLActions.setNewParam("pagesToFetch", nextPagesToFetch);
      }

      const maxPagesToFetch = getPossiblePagesToFetch(nextPage);
      if (+nextPagesToFetch < 1 || nextPagesToFetch[0] === "0") {
        nextPagesToFetch = 1;
        url = URLActions.setNewParam("pagesToFetch", nextPagesToFetch);
      };
      
      if (+nextPagesToFetch > maxPagesToFetch && totalPages) {
        nextPagesToFetch = maxPagesToFetch;
        url = URLActions.setNewParam("pagesToFetch", nextPagesToFetch);
      };

      if (url) navigate(url.replace(basename, ""), { replace: true, preventScrollReset: true });
    }

    let nextPage = URLActions.getParamValue("page");
    let nextPagesToFetch = URLActions.getParamValue("pagesToFetch");
    replaceInvalidParams(nextPage, nextPagesToFetch);

    storeWithPagination.setPage(+nextPage);
    storeWithPagination.setPagesToFetch(+nextPagesToFetch);
  }, [location.search, totalPages, storeWithPagination, navigate]);
}

export default useGettingPaginationParams;