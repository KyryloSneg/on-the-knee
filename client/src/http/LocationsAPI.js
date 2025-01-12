import { $mockApi } from "./index";
import axios from "axios";

export async function getStreet(id) {
  const { data } = await $mockApi.get("/streets/" + id);
  return data;
}

export async function getLocations() {
  const { data } = await $mockApi.get("/cities");
  return data;
}

export async function getLocation(id) {
  const { data } = await $mockApi.get("/cities/" + id);
  return data;
}

export async function getDistrict(id) {
  const { data } = await $mockApi.get("/districts/" + id);
  return data;
}

export async function getRegion(id) {
  const { data } = await $mockApi.get("/regions/" + id);
  return data;
}

export async function getCountry(id) {
  const { data } = await $mockApi.get("/countries/" + id);
  return data;
}

/**
 * @typedef {Object} latLngObject
 * @property {number} lat
 * @property {number} lng
 */
/**
 * 
 * @param {Object} location - location (city)
 * @param {Object} options 
 * @param {boolean} [options.isPreciseToHouseNumber=false] - are coords is precise to house number level
 * @param {Object | null} [options.street=null] - if is precise to house number level, pass it
 * @param {Object | null} [options.houseNumber=null] - if is precise to house number level, pass it
 * 
 * @return {latLngObject}
 */
export async function getLocationCoords(
  location, options = { isPreciseToHouseNumber: false, street: null, houseNumber: null } 
) {
  const country = await getCountry(location.countryId);

  let query;
  if (
    !location.districtId || !location.regionId 
    // doing this weird check because the api I use somehow can't precisely find Brovary
    // if we use the more accurate query from the else block below
    || location.name.toLowerCase() === "brovary"
  ) {
    if (options.isPreciseToHouseNumber) {
      query = `${options.houseNumber}, ${options.street.name}, ${location.name}, ${country.name}`;
    } else {
      query = `${location.name}, ${country.name}`;
    }
  } else {
    const district = await getDistrict(location.districtId);
    const region = await getRegion(location.regionId);

    if (options.isPreciseToHouseNumber) {
      query = `${options.houseNumber}, ${options.street.name}, ${location.name}, ${district.name}, ${region.name}, ${country.name}`;
    } else {
      query = `${location.name}, ${district.name}, ${region.name}, ${country.name}`;
    }
  }

  const { data } = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?key=${process.env.REACT_APP_OPENCAGE_API_KEY}&q=${encodeURIComponent(query)}&pretty=1&no_annotations=1`
  );

  const { lat, lng } = data?.results[0]?.geometry || { lat: 0, lng: 0 };
  return { lat, lng };
}