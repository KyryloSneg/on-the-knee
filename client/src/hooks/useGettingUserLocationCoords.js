import { useContext, useEffect } from "react";
import useFetching from "./useFetching";
import { Context } from "../Context";
import { getLocationCoords } from "../http/LocationsAPI";

function useGettingUserLocationCoords(setCoords) {
  const { app } = useContext(Context);

  async function fetchingFunc() {
    const { lat, lng } = await getLocationCoords(app.userLocation);
    setCoords({ lng, lat });
  }

  const [fetching, , error] = useFetching(fetchingFunc);
  if (error) console.log(error);

  useEffect(() => {
    if (app.userLocation) fetching();
  }, [setCoords, app.userLocation, fetching]);

}

export default useGettingUserLocationCoords;