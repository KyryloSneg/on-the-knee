import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import encodeUrl from "../utils/encodeUrl";

function useNavigateToEncodedURL() {
  const navigate = useNavigate();

  function encodedNavigate(url, options) {
    navigate(encodeUrl(url), options);
  }

  const encodedNavigateCallback = useCallback(encodedNavigate, [navigate]);
  return encodedNavigateCallback;
}

export default useNavigateToEncodedURL;