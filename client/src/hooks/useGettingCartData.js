import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { getOneCartDeviceCombinations } from "../http/CartAPI";
import { Context } from "../Context";
import { getOneStock } from "../http/StocksAPI";

function useGettingCartData(cartId, setCartDevCombos = null, isUserStore = false, isToFetch = true) {
  const { user: userStore } = useContext(Context);

  async function fetchingFunc(propsCartId = null, propsSetCartDevCombos = null, propsIsUserStore = false) {
    let cartDevCombos = [];

    if (userStore.isAuth) {
      cartDevCombos = await getOneCartDeviceCombinations(propsCartId)
    } else {
      cartDevCombos = JSON.parse(localStorage.getItem("cartDeviceCombinations")) || [];
    }

    try {
      // deleting every cart combo that is out of stock
      // (that could happen if user hasn't checked cart for a while)
      const filterResultsPromises = cartDevCombos.map(async combo => {
        const stock = await getOneStock(combo["device-combination"].stockId);
        return stock?.totalStock !== 0;
      });
  
      const filterResults = await Promise.all(filterResultsPromises);
      cartDevCombos = cartDevCombos.filter((combo, index) => filterResults[index]);
    } catch (e) {
      console.log(e.message);
    }

    if (propsIsUserStore) {
      userStore.setCartDeviceCombinations(cartDevCombos);
    } else {
      if (propsSetCartDevCombos) propsSetCartDevCombos(cartDevCombos);
    }
  }

  const [fetching] = useFetching(
    (propsCartId, propsSetCartDevCombos, propsIsUserStore) => 
      fetchingFunc(propsCartId, propsSetCartDevCombos, propsIsUserStore)
  );

  useEffect(() => {
    if (isToFetch) fetching(cartId, setCartDevCombos, isUserStore);
  }, [cartId, setCartDevCombos, isUserStore, isToFetch, fetching]);

  return fetching;
}

export default useGettingCartData;