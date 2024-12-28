import { useContext, useEffect, useRef } from "react";
import useIsGlobalLoadingSetter from "./useIsGlobalLoadingSetter";
import useFetching from "./useFetching";
import useLoadingSyncWithGlobalLoading from "./useLoadingSyncWithGlobalLoading";
import { getOneSale } from "http/SalesAPI";
import { Context } from "Context";

/**
  * hook that is used for a sale fetching
  * 
  * @param {number} id - sale id
  * @param {Object} options
  * @param {null | function()} [options.setSale=null] - sale setter function
  * @param {boolean} [options.isToFetch=true] - is to fetch sale
  * @param {boolean} [options.isSalePageFetch=false] - is this hook used from the sale page
  */
export default function useOneSaleFetching(id, options = { setSale: null, isToFetch: true, isSalePageFetch: false }) {
  const { oneSalePageStore, fetchRefStore } = useContext(Context);
  const isGlobalLoadingSetter = useIsGlobalLoadingSetter();
  const saleIdRef = useRef(id);

  useEffect(() => {
    saleIdRef.current = id;
  }, [id]);

  async function fetchingCallback() {
    const fetchedSale = await getOneSale(saleIdRef.current);
    
    if (options.isSalePageFetch) {
      oneSalePageStore.setSale(fetchedSale);
      fetchRefStore.setLastSalePageSaleFetchResult(fetchedSale);
    } else {
      options.setSale?.(fetchedSale);
    }
  }

  const [fetching, isLoading, error] = useFetching(fetchingCallback);
  useLoadingSyncWithGlobalLoading(isLoading, isGlobalLoadingSetter);

  useEffect(() => {
    if (id && options.isToFetch) fetching();
  }, [id, options.isToFetch, fetching]);

  return [fetching, isLoading, error];
}