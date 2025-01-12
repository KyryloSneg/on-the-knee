import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { deleteCartDeviceCombination, getOneCartDeviceCombinations, getOneCartSelectedAdditionalServices, patchCartSelectedAdditionalServices } from "../http/CartAPI";
import { Context } from "../Context";
import { getOneStock } from "../http/StocksAPI";
import _ from "lodash";
import LocalStorageActions from "../utils/LocalStorageActions";
import { getOneDeviceSaleDevices } from "../http/SalesAPI";
import { getDevice, getDeviceCombination } from "../http/DeviceApi";
import deleteFetchWithTryCatch from "utils/deleteFetchWithTryCatch";
import useIsGlobalLoadingSetter from "./useIsGlobalLoadingSetter";

// haven't implemented setCartSelectedAdditionalServices 'cause i have no need in it rn
// cartId is optional if isToFetch === false
function useGettingCartData(
  cartId = null, setCartDevCombos = null, isUserStore = false,
  isToFetch = true, isToSetGlobalLoading = false, propToInvokeEffect = null
) {
  const { user: userStore } = useContext(Context);
  const isGlobalLoadingSetter = useIsGlobalLoadingSetter();

  async function fetchingFunc(propsCartId = null, propsSetCartDevCombos = null, propsIsUserStore = false) {
    if (isToSetGlobalLoading) isGlobalLoadingSetter(true);

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

    async function validateComboAmounts(cartCombos) {
      const combosWithValidatedAmounts = await Promise.all(cartCombos?.map(async combo => {
        let stock;
        try {
          stock = await getOneStock(combo?.["device-combination"]?.stockId);
        } catch (e) {
          console.log(e.message);
        }

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

      const isNotEqualValidatedCombosToInitCombos = !_.isEqual(cartCombos, combosWithValidatedAmounts);
      const isToUpdateCombosWithValidated = combosWithValidatedAmounts && isNotEqualValidatedCombosToInitCombos;

      if (isToUpdateCombosWithValidated) {
        cartCombos = combosWithValidatedAmounts;
      };
    }

    async function updateDeviceAndDeviceComboFields(cartCombos) {
      cartCombos = await Promise.all(cartCombos.map(async cartCombo => {
        try {
          cartCombo.device = await getDevice(cartCombo?.deviceId);
          cartCombo["device-combination"] = await getDeviceCombination(cartCombo?.["device-combinationId"]);

          return cartCombo;
        } catch (e) {
          // if device or a device combo doesn't exist, delete it
          if (e.response.status === 404) {
            return null;
          } else {
            return cartCombo;
          }
        }
      }));

      cartCombos = cartCombos.filter(cartCombo => !!cartCombo);

      return cartCombos;
    }

    async function setCartDeviceSaleDevices(cartDevCombos) {
      // setting sale-devices to devices to save info about possible discounted price (and other sales related to devices)
      await Promise.all(cartDevCombos.map(async combo => {
        if (combo?.device?.id || combo?.device?.id === 0) {
          combo.device["sale-devices"] = await getOneDeviceSaleDevices(combo?.device?.id);
        }

        return combo;
      }));
    }

    // we change our localStorage value at the end of the fetchingFunc if !userStore.isAuth
    // we can delete some values on the server if the related device or device combo was deleted

    if (userStore.isAuth) {
      cartDevCombos = await getOneCartDeviceCombinations(propsCartId);
      const initCartDevCombos = _.cloneDeep(cartDevCombos);

      let deletedCombos = [];
      
      for (let initCombo of initCartDevCombos) {
        const currComboInActualCombos = cartDevCombos.find(combo => combo.id === initCombo.id);
        const isDeletedCombo = !currComboInActualCombos;
        
        if (isDeletedCombo) {
          deletedCombos.push(currComboInActualCombos);
          await deleteFetchWithTryCatch(async () => await deleteCartDeviceCombination(initCombo.id), false);
        };
      };

      // filter combos from the deleted on the server ones
      cartDevCombos = cartDevCombos?.filter(cartCombo => !deletedCombos.find(combo => combo.id === cartCombo.id));

      await setCartDeviceSaleDevices(cartDevCombos);
      await validateComboAmounts(cartDevCombos);

      initCartSelectedAdditionalServices =
        (await getOneCartSelectedAdditionalServices(propsCartId))
        || cartSelectedAddServicesPlaceholder;
    } else {
      cartDevCombos = LocalStorageActions.getItem("cartDeviceCombinations") || [];
      
      await updateDeviceAndDeviceComboFields(cartDevCombos);
      await setCartDeviceSaleDevices(cartDevCombos);

      await validateComboAmounts(cartDevCombos);

      initCartSelectedAdditionalServices =
        LocalStorageActions.getItem("cartSelectedAddServices")
        || cartSelectedAddServicesPlaceholder;

      if (_.isEqual(initCartSelectedAdditionalServices, {})) {
        initCartSelectedAdditionalServices = cartSelectedAddServicesPlaceholder;
      }
    }

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
      // or (device / device combination) of which was deleted
      // and deleting related to it selected additional services
      // (that could happen if user hasn't checked cart for a while)
      const filterResultsPromises = cartDevCombos.map(async combo => {
        try {
          const fetchedDevice = await getDevice(combo?.device?.id);
          const fetchedDeviceCombo = await getDeviceCombination(combo?.["device-combination"]?.id);

          if (fetchedDevice && fetchedDeviceCombo) {
            if (combo.device.isPreOrder) {
              return true;
            } else {
              const stock = await getOneStock(combo["device-combination"].stockId);
              let isInStock = stock?.totalStock !== 0;

              return isInStock;
            }
          } else return false;
        } catch (e) {
          // delete the combo if we haven't found device / device combo by their id
          // (possibly we can do the thing if we couldn't find the combo stock)
          console.log(e);

          return e.response.status !== 404;
        }
      });

      const filterResults = await Promise.all(filterResultsPromises);

      for (let [index, result] of Object.entries(filterResults)) {
        if (!result) {
          const deletedComboId = cartDevCombos[index].id

          if (userStore.isAuth) {
            await deleteFetchWithTryCatch(async () => await deleteCartDeviceCombination(deletedComboId), false);
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
      if (
          _.isEqual(LocalStorageActions.getItem("cartDeviceCombinations"), {})
          || !_.isEqual(LocalStorageActions.getItem("cartDeviceCombinations"), cartDevCombos)
      ) {
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
      fetchingFunc(propsCartId, propsSetCartDevCombos, propsIsUserStore),
    0, () => { if (isToSetGlobalLoading) isGlobalLoadingSetter(false) }
  );

  useEffect(() => {
    if (isToFetch && cartId) fetching(cartId, setCartDevCombos, isUserStore);
  }, [cartId, setCartDevCombos, isUserStore, isToFetch, fetching, propToInvokeEffect]);

  return fetching;
}

export default useGettingCartData;