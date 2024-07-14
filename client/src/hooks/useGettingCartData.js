import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { getOneCartDeviceCombinations } from "../http/CartAPI";
import { Context } from "../Context";

function useGettingCartData(cartId, setCartDevCombos = null, isUserStore = false, isToFetch = true) {
  const { user: userStore } = useContext(Context);

  async function fetchingFunc(propsCartId = null, propsSetCartDevCombos = null, propsIsUserStore = false) {
    let cartDevCombos = [];

    if (userStore.isAuth) {
      if (propsCartId) cartDevCombos = await getOneCartDeviceCombinations(propsCartId);
    } else {
      cartDevCombos = JSON.parse(localStorage.getItem("cartDeviceCombinations")) || [];
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