import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { deleteCartDeviceCombination, getOneCartDeviceCombinations, getOneCartSelectedAdditionalServices, patchCartSelectedAdditionalServices } from "../http/CartAPI";
import { Context } from "../Context";
import { getOneStock } from "../http/StocksAPI";
import _ from "lodash";
import LocalStorageActions from "../utils/LocalStorageActions";

// haven't implemented setCartSelectedAdditionalServices 'cause i have no need in it rn
function useGettingCartData(cartId, setCartDevCombos = null, isUserStore = false, isToFetch = true) {
  const { user: userStore } = useContext(Context);

  async function fetchingFunc(propsCartId = null, propsSetCartDevCombos = null, propsIsUserStore = false) {
    let cartDevCombos = [];
    let initCartSelectedAdditionalServices = {};
    const cartSelectedAddServicesPlaceholder = {
      "id": null,
      "cartId": null,
      "selected-additional-services": {},
    };

    // cartSelectedAdditionalServices fetch result example:
    // [
    //   {
    //     "id": "88307f19-80ac-463e-a043-b0252e110019",
    //     "cartId": "aff2442e-c56b-4764-b8f3-4d388bd64f77",
    //     "selected-additional-services": {...}
    //   }
    // ]

    // but getting only the first one (because we can't have more)

    if (userStore.isAuth) {
      cartDevCombos = await getOneCartDeviceCombinations(propsCartId)
      initCartSelectedAdditionalServices =
        (await getOneCartSelectedAdditionalServices(propsCartId))[0]
        || cartSelectedAddServicesPlaceholder;
    } else {
      cartDevCombos = LocalStorageActions.getItem("cartDeviceCombinations") || [];
      const combosWithValidatedAmounts = await Promise.all(cartDevCombos?.map(async combo => {
        const stock = await getOneStock(combo["device-combination"].stockId);

        let validatedAmount;
        if (stock?.totalStock) {
          if (combo.amount > stock.totalStock) {
            validatedAmount = stock.totalStock;
          } else if (combo.amount < 1) {
            validatedAmount = 1;
          } else {
            validatedAmount = combo.amount;
          }
        } else {
          validatedAmount = 1;
        }

        return { ...combo, amount: validatedAmount };
      }));

      console.log(combosWithValidatedAmounts, cartDevCombos);

      if (combosWithValidatedAmounts && !_.isEqual(cartDevCombos, combosWithValidatedAmounts)) {
        cartDevCombos = combosWithValidatedAmounts;
        localStorage.setItem("cartDeviceCombinations", JSON.stringify(combosWithValidatedAmounts));
      };

      initCartSelectedAdditionalServices = 
        LocalStorageActions.getItem("cartSelectedAddServices") 
        || cartSelectedAddServicesPlaceholder;

      if (_.isEqual(initCartSelectedAdditionalServices, {})) {
        initCartSelectedAdditionalServices = cartSelectedAddServicesPlaceholder;
      }
    }

    cartDevCombos = [...cartDevCombos, ...cartDevCombos, ...cartDevCombos]
    let cartDevCombosCopy = [...cartDevCombos];
    // deleting repeating values
    let pushedCombos = [];
    cartDevCombos = cartDevCombosCopy.filter(combo => {
      const isRepeated = pushedCombos.includes(combo);
      if (!isRepeated) {
        pushedCombos.push(combo);
      }

      return !isRepeated;
    });

    let cartSelectedAdditionalServices = _.cloneDeep(initCartSelectedAdditionalServices);
    try {
      // deleting every cart combo that is out of stock
      // and related to it selected additional services
      // (that could happen if user hasn't checked cart for a while)
      const filterResultsPromises = cartDevCombos.map(async combo => {
        if (combo.device.isPreOrder) {
          return true;
        } else {
          const stock = await getOneStock(combo["device-combination"].stockId);
          let isInStock = stock?.totalStock !== 0;

          return isInStock;
        }
      });

      const filterResults = await Promise.all(filterResultsPromises);
      for (let [index, result] of Object.entries(filterResults)) {
        if (!result) {
          const deletedComboId = cartDevCombos[index].id

          if (userStore.isAuth) {
            try {
              await deleteCartDeviceCombination(deletedComboId);
            } catch (e) {
              if (e.response.status !== 500) console.log(e.message);
            }
          }

          if (cartSelectedAdditionalServices["selected-additional-services"][deletedComboId]) {
            delete cartSelectedAdditionalServices["selected-additional-services"][deletedComboId]
          };
        }
      }

      cartDevCombos = cartDevCombos.filter((combo, index) => filterResults[index]);

      if (!_.isEqual(
        cartSelectedAdditionalServices["selected-additional-services"],
        initCartSelectedAdditionalServices["selected-additional-services"]
      )) {
        if (userStore.isAuth) {
          try {
            await patchCartSelectedAdditionalServices(
              cartSelectedAdditionalServices.id,
              { "selected-additional-services": cartSelectedAdditionalServices["selected-additional-services"] }
            );
          } catch (e) {
            console.log(e.message);
          }
        } else {
          localStorage.setItem("cartSelectedAddServices", JSON.stringify(cartSelectedAdditionalServices));
        }
      }

    } catch (e) {
      console.log(e.message);
    }

    if (!userStore.isAuth) {
      if (_.isEqual(LocalStorageActions.getItem("cartDeviceCombinations"), {})) {
        localStorage.setItem("cartDeviceCombinations", JSON.stringify(cartDevCombos));
      }

      if (_.isEqual(LocalStorageActions.getItem("cartSelectedAddServices"), {})) {
        localStorage.setItem("cartSelectedAddServices", JSON.stringify(cartSelectedAddServicesPlaceholder));
      }
    }

    if (propsIsUserStore) {
      userStore.setCartDeviceCombinations(cartDevCombos);
      userStore.setCartSelectedAdditionalServices(cartSelectedAdditionalServices);
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