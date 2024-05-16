import { useCallback, useState } from "react";

function useFetching(callback, settingIsLoadingDelay = 0, finallyCallback = null, dependencies = []) {
  const [fetchResult, setFetchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetching = useCallback(async (...args) => {
    try {
      setIsLoading(true);
      const result = await callback(...args);
      // if everything is ok and we fetched some data there's no error
      setFetchResult(result);
      setError('');
    } catch(e) {
      setError(e.message);
    } finally {
      if (finallyCallback) finallyCallback();
      setTimeout(() => {
        setIsLoading(false); 
      }, settingIsLoadingDelay);
    }
    // eslint-disable-next-line
  }, dependencies);

  return [fetching, isLoading, error, fetchResult]
}

export default useFetching;