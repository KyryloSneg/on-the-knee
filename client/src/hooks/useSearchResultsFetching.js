import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import StringActions from "../utils/StringActions";

// query params without pagination ones
function useSearchResultsFetching(results, setResults, backupValue) {
  const { app, deviceStore } = useContext(Context);
  
  async function fetchingCallback(backupValue) {
    let hintResults = [];
    if (!!backupValue.trim().length) {
      const allHintSearchResults = [...app.hintSearchResults];
      const trimmedBackupValue = StringActions.removeRedundantSpaces(backupValue);

      hintResults = allHintSearchResults.filter(result => 
        result.value.startsWith(trimmedBackupValue) && trimmedBackupValue.length < result.value.length
      );
    }

    const deviceResults = results.device;
    const categoryResults = results.category;
    const historyResults = JSON.parse(localStorage.getItem("historyResults")) || [];
    
    const nextResults = {
      hint: hintResults,
      device: deviceResults,
      category: categoryResults,
      history: historyResults,
    };

    setResults(nextResults);
  }

  const [fetching, isLoading, error] = useFetching((backupValue) => fetchingCallback(backupValue));

  useEffect(() => {
    fetching(backupValue);
    // eslint-disable-next-line
  }, [backupValue, app.isFocusedSearchForm]);

  return [isLoading, error, fetching];
}

export default useSearchResultsFetching;