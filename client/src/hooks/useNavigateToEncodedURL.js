import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

function useNavigateToEncodedURL() {
  const navigate = useNavigate();

  function encodedNavigate(url, options) {
    navigate(encodeUrl(url), options);
  }

  function encodeUrl(url) {
    return url.replaceAll("%2C", ",").replaceAll("%3B", ";");
  }

  const encodedNavigateCallback = useCallback(encodedNavigate, [navigate]);
  return encodedNavigateCallback;
}

export default useNavigateToEncodedURL;