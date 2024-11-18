import { useCallback, useRef, useState } from "react";

function useFetching(callback, settingIsLoadingDelay = 0, finallyCallback = null, dependencies = []) {
  const [fetchResult, setFetchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  let fetchResultRef = useRef(null);

  const fetching = useCallback(async (...args) => {
    let result;

    try {
      setIsLoading(true);
      result = await callback(...args);
      // if everything is ok and we fetched some data there's no error
      fetchResultRef.current = result;
      setFetchResult(result);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      if (finallyCallback) finallyCallback();
      setTimeout(() => {
        setIsLoading(false); 
      }, settingIsLoadingDelay);
    }

    return result;
    // eslint-disable-next-line
  }, dependencies);

  return [fetching, isLoading, error, fetchResult, fetchResultRef]
}

export default useFetching;