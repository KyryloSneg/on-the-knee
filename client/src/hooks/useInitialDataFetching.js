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
import { getOneCart, getOneCartDeviceCombinations } from "../http/CartAPI";
import { MOCK_USER } from "../utils/mobxStoresConsts";
import useGettingCartData from "./useGettingCartData";

function useInitialDataFetching() {
  const { app, deviceStore, user } = useContext(Context);

  async function fetchData() {
    const brands = await getBrands();
    const categories = await getCategories();
    const sales = await getSales();
    const saleTypeNames = await getSaleTypeNames();
    const stocks = await getStocks();
    const hintSearchResults = await getHintSearchResults();
    const allLocations = await getLocations();
    const allStorePickupPoints = await getStorePickupPoints();

    let userLocation = JSON.parse(localStorage.getItem("location"));
    if (!userLocation) {
      try {
        // auto-getting user location
        // (using try ... catch because ipify crushes sometimes)
        const fetchedUserLocation = await getUserLocation();
        userLocation = allLocations.find(location => location.name === fetchedUserLocation.city);
      } catch (e) {
        console.log(e.message);
      }

      app.setIsUserLocationDeterminedCorrectly(!!userLocation);
      if (!userLocation) {
        // if we still haven't found user location, set default one (Kyiv)
        userLocation = allLocations.find(location => location.name === DEFAULT_USER_LOCATION_NAME);
      }

      app.setIsToShowUserLocationNotification(true);
      localStorage.setItem("location", JSON.stringify(userLocation))
    }

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
    // sorting categories by id
    const sortedCategories = ArrayActions.sortNumberObjectArray(categories, "id");

    let cart = {};
    let cartDeviceCombinations = [];

    if (user.isAuth) {
      cart = await getOneCart(MOCK_USER._id);
      cartDeviceCombinations = await getOneCartDeviceCombinations(cart?.id);
    } else {
      cartDeviceCombinations = JSON.parse(localStorage.getItem("cartDeviceCombinations")) || [];
    }

    deviceStore.setBrands(brands);
    deviceStore.setCategories(sortedCategories);
    deviceStore.setSales(sales);
    deviceStore.setSaleTypeNames(saleTypeNames);
    deviceStore.setStocks(stocks);
    
    app.setHintSearchResults(sortedHintResults);
    app.setAllLocations(allLocations);
    app.setUserLocation(userLocation);
    app.setStorePickupPoints(allStorePickupPoints);

    if (cart) user.setCart(cart);
    if (cartDeviceCombinations) user.setCartDeviceCombinations(cartDeviceCombinations);
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