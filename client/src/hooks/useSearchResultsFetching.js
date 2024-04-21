import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";

// query params without pagination ones
function useSearchResultsFetching(results, setResults, backupValue) {
  const { app, deviceStore } = useContext(Context);
  
  async function fetchingCallback() {
    const hintResults = results.hint;
    const deviceResults = results.device;
    const categoryResults = results.category;
    const historyResults = JSON.parse(localStorage.getItem("historyResults")) || [];
    console.log(historyResults);
    
    const nextResults = {
      hint: hintResults,
      device: deviceResults,
      category: categoryResults,
      history: historyResults,
    };

    setResults(nextResults);
  }

  const [fetching, isLoading, error] = useFetching(fetchingCallback);

  useEffect(() => {
    fetching();
    // eslint-disable-next-line
  }, [backupValue, app.isFocusedSearchForm]);

  return [isLoading, error, fetching];
}

export default useSearchResultsFetching;