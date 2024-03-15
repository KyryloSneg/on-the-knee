import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import { getBrands } from "../http/BrandsAPI";
import { getCategories } from "../http/CategoriesAPI";
import ArrayActions from "../utils/ArrayActions";

function useInitialDataFetching() {
  const { deviceStore } = useContext(Context);

  async function fetchData() {
    const brands = await getBrands();
    const categories = await getCategories();

    // sorting categories by id
    const sortedCategories = ArrayActions.sortNumberObjectArray(categories, "id");

    deviceStore.setBrands(brands);
    deviceStore.setCategories(sortedCategories);
  }

  const [fetching, isLoading, error] = useFetching(fetchData);

  useEffect(() => {
    fetching();
  }, [fetching]);

  return [isLoading, error, fetching];
}

export default useInitialDataFetching;