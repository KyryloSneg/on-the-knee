import { $mockApi } from "./index";
import { getLocation, getLocationCoords, getStreet } from "./LocationsAPI";

export async function getStorePickupPoints() {
  const { data } = await $mockApi.get("/store-pickup-points");

  function hasCoords(point) {
    return (
      (point?.lat !== undefined && point?.lat !== null)
      && (point?.lng !== undefined && point?.lng !== null)
    );
  }

  // set lat, lng if mock server hasn't set them (useful if user tests the app following the manual of the repository README.md)
  if (Array.isArray(data)) {
    for (let storePickupPoint of data) {
      if (!hasCoords(storePickupPoint) && storePickupPoint?.cityId) {
        const city = await getLocation(storePickupPoint.cityId);
        
        if (city) {
          const street = await getStreet(storePickupPoint.streetId);
          const isPreciseToHouseNumber = (
            street && (storePickupPoint.houseNumber !== undefined && storePickupPoint.houseNumber !== null)
          );

          const { lat, lng } = await getLocationCoords(city, { 
            isPreciseToHouseNumber: isPreciseToHouseNumber, street: street, houseNumber: storePickupPoint.houseNumber 
          });

          storePickupPoint.lat = lat;
          storePickupPoint.lng = lng;
        }
      }
    }
  }

  return data;
}

export async function getOneStorePickupPoint(id) {
  const { data } = await $mockApi.get("/store-pickup-points/" + id);
  return data;
}