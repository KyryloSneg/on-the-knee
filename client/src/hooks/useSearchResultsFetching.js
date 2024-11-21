import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import StringActions from "../utils/StringActions";
import getDevicesBySearchQuery from "../utils/getDevicesBySearchQuery";
import { CATEGORY_SEARCH_RESULTS_MAX_AMOUNT, DEVICE_SEARCH_RESULTS_MAX_AMOUNT, HINT_SEARCH_RESULTS_MAX_AMOUNT } from "../utils/consts";
import getPreparedForMockServerStr from "../utils/getPreparedForMockServerStr";
import LocalStorageActions from "../utils/LocalStorageActions";

// query params without pagination ones
function useSearchResultsFetching(setResults, backupValue) {
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

    let deviceResults = [];
    if (backupValue.trim().length > 2) {
      const preparedBackupValue = getPreparedForMockServerStr(backupValue);
      const fetchStringQueryParams = `name_like=${preparedBackupValue.trim().toLowerCase()}`.replaceAll(`"`, "");
      try {
        deviceResults = (await getDevicesBySearchQuery(fetchStringQueryParams)).devices;
      } catch (e) {
        console.log(e.message);
      }
    }
    
    const categoryResults = deviceResults.map(device => {
      const category = deviceStore.categories.find(cat => +cat.id === +device.categoryId);
      return category;
    });

    const historyResults = LocalStorageActions.getItem("historyResults") || [];
    const nextResults = {
      hint: hintResults.slice(0, HINT_SEARCH_RESULTS_MAX_AMOUNT),
      device: deviceResults.slice(0, DEVICE_SEARCH_RESULTS_MAX_AMOUNT),
      category: categoryResults.slice(0, CATEGORY_SEARCH_RESULTS_MAX_AMOUNT),
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