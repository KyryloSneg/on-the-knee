import { Context } from "Context";
import _ from "lodash";
import { useCallback, useContext, useMemo } from "react";
import { v4 } from "uuid";

// isGlobalLoading setter that is used instead of the fetchRefStore's one;
// this function prevents the race between different isGlobalLoading sets
// (visually, it combines several consecutive global loadings into a single one)

export default function useIsGlobalLoadingSetter() {
  const { app, fetchRefStore } = useContext(Context);
  const id = useMemo(() => v4(), []);

  const setter = useCallback(value => {
    let globalLoadingChangesObjCopy = _.cloneDeep(fetchRefStore.globalLoadingChangesObj);
    
    const doesIncludeTrue = !!Object.entries(globalLoadingChangesObjCopy).find(([key, val]) => key !== id && val);
    globalLoadingChangesObjCopy[id] = value;
    
    if (value) {
      // unnecessary condition but let it be
      if (!doesIncludeTrue) app.setIsGlobalLoading(true);
    } else {
      if (!doesIncludeTrue) {
        if (globalLoadingChangesObjCopy.hasOwnProperty(id)) {
          delete globalLoadingChangesObjCopy[id];
        }

        app.setIsGlobalLoading(false);
      }
    }

    fetchRefStore.setGlobalLoadingChangesObj(globalLoadingChangesObjCopy);
  }, [app, fetchRefStore, id]);

  return setter;
}