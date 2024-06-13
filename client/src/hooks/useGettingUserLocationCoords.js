import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import axios from "axios";
import { getCountry, getDistrict, getRegion } from "../http/LocationsAPI";

function useGettingUserLocationCoords(setCoords) {
  const { app } = useContext(Context);

  async function fetchingFunc() {
    const country = await getCountry(app.userLocation.countryId);

    let query;
    if (
      !app.userLocation.districtId || app.userLocation.regionId 
      || app.userLocation.name === "Brovary"
    ) {
      query = `${app.userLocation.name}, ${country.name}`;
    } else {
      const district = await getDistrict(app.userLocation.districtId);
      const region = await getRegion(app.userLocation.regionId);

      query = `${app.userLocation.name}, ${district.name}, ${region.name}, ${country.name}`;
    }

    const { data } = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?key=${process.env.REACT_APP_OPENCAGE_API_KEY}&q=${encodeURIComponent(query)}&pretty=1&no_annotations=1`
    );

    const { lat, lng } = data?.results[0]?.geometry || {};
    if (lat && lng) setCoords({ lng, lat });
  }

  const [fetching, , error] = useFetching(fetchingFunc);
  if (error) console.log(error);

  useEffect(() => {
    if (app.userLocation) fetching();
  }, [setCoords, app.userLocation, fetching]);

}

export default useGettingUserLocationCoords;