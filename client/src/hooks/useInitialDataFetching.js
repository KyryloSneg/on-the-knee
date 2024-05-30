import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import { getBrands } from "../http/BrandsAPI";
import { getCategories } from "../http/CategoriesAPI";
import ArrayActions from "../utils/ArrayActions";
import { getHintSearchResults } from "../http/HintSearchResultsAPI";
import { getSales } from "../http/SalesAPI";
import { getStocks } from "../http/StocksAPI";
import { getLocations } from "../http/LocationsAPI";
import { getUserLocation } from "../http/UserLocationAPI";
import { DEFAULT_USER_LOCATION_NAME } from "../utils/consts";

function useInitialDataFetching() {
  const { app, deviceStore } = useContext(Context);

  async function fetchData() {
    const brands = await getBrands();
    const categories = await getCategories();
    const sales = await getSales();
    const stocks = await getStocks();
    const hintSearchResults = await getHintSearchResults();

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

    deviceStore.setBrands(brands);
    deviceStore.setCategories(sortedCategories);
    deviceStore.setSales(sales);
    deviceStore.setStocks(stocks);
    app.setHintSearchResults(sortedHintResults);
    app.setAllLocations(allLocations);
    app.setUserLocation(userLocation);
  }

  const [fetching, isLoading, error] = useFetching(fetchData);

  useEffect(() => {
    fetching();
  }, [fetching]);

  return [isLoading, error, fetching];
}

export default useInitialDataFetching;