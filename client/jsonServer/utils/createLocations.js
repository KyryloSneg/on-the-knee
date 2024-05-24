const { faker } = require("@faker-js/faker");
const StringActions = require("./StringActions");
const { STORE_LOCATIONS } = require("./consts");
const { getLocationCoords } = require("../http/mapDataManagerAPI");
const uaCities = require("../data/ua.json");

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
          "type": cityInfo.type,
          "name": StringActions.capitalize(city),
          "population": cityInfo.population,
          "countryId": country.id,
          "regionId": dbRegion.id,
          "districtId": currentDistrict.id,
          "isAccessible": dbCityId === 1 || !faker.datatype.boolean(0.15), // we guarantee that there will be at least one accessible city
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

  const ukraineId = countries.find(country => country.name === "Ukraine").id;
  for (let uaCity of uaCities) {
    const doesExist = !!cities.find(city => city.name === uaCity.city);
    if (doesExist) continue;

    const id = cities.length + 1;
    let type;

    if (+uaCity.population < 5000) {
      type = "village"; // объединил деревню и село в одно понятие
    } else if (+uaCity.population >= 5000 && +uaCity.population < 10000) {
      type = "urban settlement"; // пгт
    } else {
      type = "city";
    }

    let region = regions.find(regionItem => regionItem.name === uaCity["admin_name"]);
    if (!region) {
      region = {
        "id": regions.length + 1,
        "name": uaCity["admin_name"]
      };

      regions.push(region);
    }

    // in .json file there's no any info about city's district
    const district = districts[faker.number.int({ min: 0, max: districts.length - 1 })]; 
    const city = {
      "id": id,
      "type": type,
      "name": uaCity.city,
      "population": +uaCity.population,
      "countryId": ukraineId,
      "regionId": region.id,
      "districtId": district.id,
      "isAccessible": true
    }

    cities.push(city);
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