import { useEffect } from "react";

function useChangingMinMaxIds(minIdRef, maxIdRef, setSelectedId, results, backupValue) {

  useEffect(() => {
    let minimumId = null;
    let maximumId = null;

    let searchResultElems = document.body.getElementsByClassName("search-result");
    if (searchResultElems.length) {
      minimumId = 1;
      maximumId = searchResultElems.length;
    }
    
    minIdRef.current = minimumId;
    maxIdRef.current = maximumId;    
  });


  // making two separate hooks to prevent selecting the first option every re-render
  // (i don't want to make different hooks here)
  useEffect(() => {
    setSelectedId(minIdRef.current);
  }, [minIdRef, backupValue, results, setSelectedId]);

}

export default useChangingMinMaxIds;