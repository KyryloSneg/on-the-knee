import { useContext, useEffect, useReducer } from "react";
import CatalogPage from './CatalogPage';
import { Context } from "Context";
import URLActions from "utils/URLActions";
import { observer } from "mobx-react-lite";
import _ from "lodash";
import { useLocation } from "react-router-dom";

const SellerDevicesPage = observer(({ seller, hasAlreadyFetchedDevicesRef, prevUsedFiltersRef, prevSortFilterRef }) => {
  const { deviceStore } = useContext(Context);
  const location = useLocation();

  // eslint-disable-next-line
  const [ignore, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    const { usedFilters } = URLActions.getUsedFilters(deviceStore.filters);
    const sortFilter = URLActions.getParamValue("sort");

    // ugly code that is used to fetch devices with the new used filters / sort filter
    if (!_.isEqual(usedFilters, prevUsedFiltersRef.current)) {
      hasAlreadyFetchedDevicesRef.current = false;
      prevUsedFiltersRef.current = usedFilters;

      forceUpdate();
    } else if (sortFilter !== prevSortFilterRef.current) {
      hasAlreadyFetchedDevicesRef.current = false;
      prevSortFilterRef.current = sortFilter;
      
      forceUpdate();
    }
  }, [location.search, deviceStore, hasAlreadyFetchedDevicesRef, prevUsedFiltersRef, prevSortFilterRef]);

  if (!seller) return <div />;
  
  return (
    <CatalogPage 
      type="seller" 
      seller={seller} 
      isToFetch={!hasAlreadyFetchedDevicesRef.current} 
      hasAlreadyFetchedDevicesRef={hasAlreadyFetchedDevicesRef} 
    />
  );
});

export default SellerDevicesPage;
