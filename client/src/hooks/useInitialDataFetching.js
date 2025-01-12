import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import { getBrands } from "../http/BrandsAPI";
import { getCategories } from "../http/CategoriesAPI";
import ArrayActions from "../utils/ArrayActions";
import { getHintSearchResults } from "../http/HintSearchResultsAPI";
import { getSales, getSaleTypeNames } from "../http/SalesAPI";
import { getStocks } from "../http/StocksAPI";
import { getLocations } from "../http/LocationsAPI";
import { getUserLocation } from "../http/UserLocationAPI";
import { DEFAULT_USER_LOCATION_NAME } from "../utils/consts";
import { getStorePickupPoints } from "../http/StorePickupPointsAPI";
import { createCart, getOneCart, getOneCartDeviceCombinations } from "../http/CartAPI";
import useGettingCartData from "./useGettingCartData";
import LocalStorageActions from "../utils/LocalStorageActions";
import { createDesiredList, getOneDesiredList, getOneDesiredListDevices } from "../http/DesiredListAPI";
import { createViewedDevicesList, getOneViewedDevicesList, getOneViewedDevicesListDevs } from "../http/ViewedDevicesAPI";
import setViewedDevicesAdditionalFields from "../utils/setViewedDevicesAdditionalFields";

function useInitialDataFetching() {
  const { app, deviceStore, user } = useContext(Context);

  async function fetchData() {
    // pasting separate block of fetching data in a different try...catch block
    // because, for example, unsuccesful fetching of brands mustn't affect
    // getting user location and so on  
    try {
      const sales = await getSales();
      const saleTypeNames = await getSaleTypeNames();
      const brands = await getBrands();
      const categories = await getCategories();
      const stocks = await getStocks();

      // sorting categories by id
      const sortedCategories = ArrayActions.sortNumberObjectArray(categories, "id");

      deviceStore.setSales(sales);
      deviceStore.setSaleTypeNames(saleTypeNames);
      deviceStore.setBrands(brands);
      deviceStore.setCategories(sortedCategories);
      deviceStore.setStocks(stocks);
    } catch (e) {
      console.log(e.message);
    } finally {
      deviceStore.setHasTriedToFetchSales(true);
    }

    try {
      const hintSearchResults = await getHintSearchResults();

      let uniqueHintResults = [];
      for (let result of hintSearchResults) {
        const isIncludedAlready = !!uniqueHintResults.find(res => res.value === result.value);
        if (!isIncludedAlready) uniqueHintResults.push(result);
      }
  
      let resultsWithAmount = uniqueHintResults.map(result => ({ value: result.value, amount: 0 }));
  
      for (let result of hintSearchResults) {
        const resultWithAmount = resultsWithAmount.find(res => res.value === result.value);
        resultWithAmount.amount = resultWithAmount.amount + 1;
      }
  
      // most popular hints are shown first
      const sortedHintResults = ArrayActions.sortNumberObjectArray(resultsWithAmount, "amount").reverse();
      app.setHintSearchResults(sortedHintResults);
    } catch (e) {
      console.log(e.message);
    }

    try {
      let allLocations = [];
      
      // wrapping up our getLocations fetch to not affect
      // userLocation that can be stored in the localStorage
      try {
        allLocations = await getLocations() || [];
      } catch(e) {
        console.log(e.message);
      }

      let userLocation = LocalStorageActions.getItem("location");
      if (!userLocation && allLocations?.length) {
        try {
          // auto-getting user location
          const fetchedUserLocation = await getUserLocation();
          userLocation = allLocations.find(
            location => location.name?.toLowerCase() === fetchedUserLocation.city.toLowerCase()
          ) || null;
        } catch (e) {
          console.log(e.message);
        }

        app.setIsUserLocationDeterminedCorrectly(!!userLocation);
        if (!userLocation) {
          // if we still haven't found user location, set default one (Kyiv)
          userLocation = allLocations.find(
            location => location.name?.toLowerCase() === DEFAULT_USER_LOCATION_NAME.toLowerCase()
          ) || null;
        }

        app.setIsToShowUserLocationNotification(true);
        if (userLocation) localStorage.setItem("location", JSON.stringify(userLocation))
      }

      app.setAllLocations(allLocations);
      app.setUserLocation(userLocation);
    } catch (e) {
      console.log(e.message);
    }

    try {
      const allStorePickupPoints = await getStorePickupPoints();
      app.setStorePickupPoints(allStorePickupPoints);
    } catch (e) {
      console.log(e.message);
    }
    
    try {
      let cart = {};
      let cartDeviceCombinations = [];
  
      if (user.isAuth) {
        cart = await getOneCart(user.user?.id);
        
        if (!cart) {
          // the logic should be located on the server if we weren't using the mock one
          // (in the dev build react will create the cart twice)
          cart = (await createCart(user.user?.id)).cartData;
        }

        cartDeviceCombinations = await getOneCartDeviceCombinations(cart?.id);
      } else {
        cartDeviceCombinations = LocalStorageActions.getItem("cartDeviceCombinations") || [];
      }
      
      if (cart) user.setCart(cart);
      if (cartDeviceCombinations) user.setCartDeviceCombinations(cartDeviceCombinations);
    } catch (e) {
      console.log(e.message);
    }

    try {
      let desiredList = {};
      let desiredListDevices = [];
  
      if (user.isAuth) {
        desiredList = await getOneDesiredList(user.user?.id);
        if (!desiredList) {
          // the logic should be located on the server if we weren't using the mock one
          // (in the dev build react will create the cart twice)
          desiredList = await createDesiredList(user.user?.id);
        }

        desiredListDevices = await getOneDesiredListDevices(desiredList?.id);
      }
      
      if (desiredList) user.setDesiredList(desiredList);
      if (desiredListDevices) user.setDesiredListDevices(desiredListDevices);
    } catch (e) {
      console.log(e.message);
    }

    try {
      let viewedDevicesList = {};
      let viewedDevices = [];
  
      if (user.isAuth) {
        viewedDevicesList = await getOneViewedDevicesList(user.user?.id);
        if (!viewedDevicesList) {
          // the logic should be located on the server if we weren't using the mock one
          // (in the dev build react will create the cart twice)
          viewedDevicesList = await createViewedDevicesList(user.user?.id);
        }

        viewedDevices = await getOneViewedDevicesListDevs(viewedDevicesList?.id);
      } else {
        viewedDevices = LocalStorageActions.getItem("viewedDevices") || [];
        viewedDevices.sort((a, b) => b.date.localeCompare(a.date));

        await setViewedDevicesAdditionalFields(viewedDevices);
      }
      
      if (viewedDevicesList) user.setViewedDevicesList(viewedDevicesList);
      if (viewedDevices) user.setViewedDevices(viewedDevices);
    } catch (e) {
      console.log(e.message);
      throw e;
    }

    app.setHasTriedToFetchInitialData(true);
  }

  const [fetching, isLoading, error] = useFetching(fetchData);

  // govno i palki (it's hard to explain what is happening here)
  const fetchingCartData = useGettingCartData(null, null, true, false);
  useEffect(() => {
    (fetching()).then(() => {
      const fetchingFn = () => fetchingCartData(user.cart?.id, null, true);
      user.setCartDataFetching(fetchingFn);
    });
  }, [fetching, user.isAuth, user, fetchingCartData]);

  return [isLoading, error, fetching];
}

export default useInitialDataFetching;