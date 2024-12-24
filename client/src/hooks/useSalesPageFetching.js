import { useContext, useEffect, useRef } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import useIsGlobalLoadingSetter from "./useIsGlobalLoadingSetter";
import useLoadingSyncWithGlobalLoading from "./useLoadingSyncWithGlobalLoading";
import useGettingSalesAndTypeNames from "./useGettingSalesAndTypeNames";
import { getSaleTypes } from "http/SalesAPI";
import _ from "lodash";

function useSalesPageFetching(slug, isToFetch = false) {
  const { salesPageStore, fetchRefStore } = useContext(Context);
  const isGlobalLoadingSetter = useIsGlobalLoadingSetter();

  const [unfilteredSalesDataFetching] = useGettingSalesAndTypeNames(false);
  const slugRef = useRef(slug);

  useEffect(() => {
    slugRef.current = slug;
  }, [slug]);

  async function fetchingCallback() {
    // idc that we're fetching saleTypeNames that we don't use in this page
    const { sales, saleTypeNames } = await unfilteredSalesDataFetching();
    const saleTypes = await getSaleTypes("?hasEnded=false&_expand=sale-type-name");

    const start = salesPageStore.limit * (salesPageStore.page - 1);
    const limit = salesPageStore.limit * salesPageStore.pagesToFetch;

    // the next logic wouldn't exist if we were using the real server
    // (sorry app optimization)
    let filteredSales = [];

    if (slugRef.current === "all") {
      // just in case
      filteredSales = _.cloneDeep(sales);
    } else {
      let requiredSaleIds = [];

      for (let type of saleTypes) {
        // there are usually no big amount of type names, so inner iterations won't affect app badly
        const typeName = saleTypeNames.find(item => item.id === type["sale-type-nameId"]);
        if (typeName.name === slugRef.current && !requiredSaleIds.includes(type.saleId)) {
          requiredSaleIds.push(type.saleId);
        }
      }

      filteredSales = sales.filter(sale => requiredSaleIds.includes(sale.id));
    }

    const pageFilteredSales = filteredSales.slice(start, (start + limit));
    const selectedSaleTypeName = slugRef.current === "all" ? null : saleTypeNames.find(item => item.name === slugRef.current);

    salesPageStore.setFilteredSales(pageFilteredSales);
    salesPageStore.setTotalCount(filteredSales.length);
    salesPageStore.setSelectedSaleTypeName(selectedSaleTypeName);
  }

  function finallyCb() {
    fetchRefStore.setLastSalesPageSlug(slugRef.current)
    fetchRefStore.setLastSalesPageFetchPageFiltersObj(
      { page: salesPageStore.page, pagesToFetch: salesPageStore.pagesToFetch } || null
    );
  }

  const [fetching, isLoading, error] = useFetching(fetchingCallback, 0, finallyCb);
  useLoadingSyncWithGlobalLoading(isLoading, isGlobalLoadingSetter);

  useEffect(() => {
    if (slug && isToFetch) fetching();
  }, [slug, isToFetch, fetching]);

  return [fetching, isLoading, error];
}

export default useSalesPageFetching;