import { useState } from "react";

function useFetching(callback, settingIsLoadingDelay = 0, finallyCallback = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetching = async (...args) => {
    try {
      setIsLoading(true)
      await callback(...args)
      // if everything is ok and we fetched some data there's no error
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      if (finallyCallback) finallyCallback();
      setTimeout(() => {
        setIsLoading(false); 
      }, settingIsLoadingDelay);
    }
  }

  return [fetching, isLoading, error]
}

export default useFetching;