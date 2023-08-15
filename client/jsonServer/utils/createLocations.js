const { faker } = require("@faker-js/faker");
const StringActions = require("./StringActions");
const { STORE_LOCATIONS } = require("./consts");
const { getLocationCoords } = require("../http/mapDataManagerAPI");

module.exports = async () => {
  let countries = [];
  let regions = [];
  let districts = [];
  let cities = [];
  let streets = [];
  let storePickupPoints = [];

  for (let [country, regs] of Object.entries(STORE_LOCATIONS)) {
    const dbCountry = {
      "id": countries.length + 1,
      "name": StringActions.capitalize(country),
    }
    countries.push(dbCountry);

    for (let [reg, cts] of Object.entries(regs)) {
      const dbRegion = {
        "id": regions.length + 1,
        "countryId": country.id,
        "name": StringActions.capitalize(reg),
      }
      regions.push(dbRegion);

      for (let [city, cityInfo] of Object.entries(cts)) {
        let dbDistrict = null;
        if (cityInfo.district) {
          dbDistrict = {
            "id": districts.length + 1,
            "regionId": dbRegion.id,
            "name": StringActions.capitalize(cityInfo.district),
          };
          districts.push(dbDistrict);
        }

        const currentDistrict = districts[districts.length - 1];
        const dbCityId = cities.length + 1;

        const dbCity = {
          "id": dbCityId,
          "regionId": dbRegion.id,
          "districtId": currentDistrict.id,
          "isAccessible": dbCityId === 1 || !faker.datatype.boolean(0.15), // we guarantee that there will be at least one accessible city
          "name": StringActions.capitalize(city),
        }
        cities.push(dbCity);

        for (let [street, houseNumbers] of Object.entries(cityInfo.streets)) {
          const dbStreet = {
            "id": streets.length + 1,
            "cityId": dbCity.id,
            "name": StringActions.capitalize(street),
          }
          streets.push(dbStreet);

          for (let number of houseNumbers) {
            const { lat, lng } = await getLocationCoords(dbCountry.name, dbRegion.name, currentDistrict.name, dbCity.name, dbStreet.name, number);
            const hasAddInfo = faker.datatype.boolean(0.5);
            
            const dbStorePickupPoint = {
              "id": storePickupPoints.length + 1,
              "streetId": dbStreet.id,
              "houseNumber": number,
              "additionalInfo": hasAddInfo ? faker.lorem.sentence(3) : null,
              "coords": { // we can put a marker of an store pickup point on the map
                "latitude": lat,
                "longitude": lng,
              },
            }

            storePickupPoints.push(dbStorePickupPoint);
          }
        }
      }
    }
  }

  return {
    countries,
    regions,
    districts,
    cities,
    streets,
    storePickupPoints,
  }
}