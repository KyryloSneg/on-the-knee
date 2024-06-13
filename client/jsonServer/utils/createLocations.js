const { faker } = require("@faker-js/faker");
const StringActions = require("./StringActions");
const { STORE_LOCATIONS, POSSIBLE_SCHEDULE_TIME_RANGES } = require("./consts");
const { getLocationCoords } = require("../http/mapDataManagerAPI");
const uaCities = require("../data/ua.json");
const DateActions = require("./DateActions");
const { parsePhoneNumber } = require("libphonenumber-js");

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

        const currentRegion = city === "Kyiv" ? null : dbRegion
        const currentDistrict = city === "Kyiv" ? null : districts[districts.length - 1];
        const dbCityId = cities.length + 1;
        const name = StringActions.capitalize(city);

        let fullName;
        if (currentDistrict && city !== "Kyiv") {
          fullName = `${name} (${currentDistrict.name}, ${dbRegion.name})`;
        } else {
          fullName = `${name}`;
        }

        const dbCity = {
          "id": dbCityId,
          "type": cityInfo.type,
          "name": name,
          "population": cityInfo.population,
          "countryId": dbCountry.id,
          "regionId": currentRegion?.id,
          "districtId": currentDistrict?.id,
          "fullName": fullName,
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
            const { lat, lng } = await getLocationCoords(dbCountry.name, currentRegion?.name, currentDistrict?.name, dbCity.name, dbStreet.name, number);
            const fullName = `${dbCity.name}, ${number} ${dbStreet.name}`;
            
            const date = new Date();
            date.setHours(0); // creating "fancy" date isn't necessary but i leave it
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);

            let possibleTimeRanges = [];
            for (let timeRanges of POSSIBLE_SCHEDULE_TIME_RANGES[2]) {
              for (let timeRange of Object.values(timeRanges)) {
                possibleTimeRanges.push(timeRange);
              }
            }

            const range = possibleTimeRanges[faker.number.int({ min: 0, max: possibleTimeRanges.length - 1 })];
            const parsedRange = DateActions.parseTimeRange(range);
    
            const startTime = new Date(date.getTime());
            DateActions.setParsedTime(startTime, parsedRange.start);
    
            const endTime = new Date(date.getTime());
            DateActions.setParsedTime(endTime, parsedRange.end);

            let phoneNumber;
            const numberObj = parsePhoneNumber("+380 " + faker.helpers.fromRegExp(/[0-9]{2} [0-9]{3} [0-9]{4}/));
            const internationalNumber = numberObj.formatInternational(); 
            phoneNumber = internationalNumber;
            
            const dbStorePickupPoint = {
              "id": storePickupPoints.length + 1,
              "cityId": dbCity.id,
              "streetId": dbStreet.id,
              "houseNumber": number,
              "fullName": fullName,
              "startTime": startTime,
              "endTime": endTime,
              "phoneNumber": phoneNumber,
              "lat": lat,
              "lng": lng
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
    // const district = districts[faker.number.int({ min: 0, max: districts.length - 1 })]; 
    const district = null;

    let fullName;
    if (district) {
      fullName = `${uaCity.city} (${district?.name}, ${region.name})`;
    } else {
      fullName = `${uaCity.city} (${region.name})`;
    }

    const city = {
      "id": id,
      "type": type,
      "name": uaCity.city,
      "population": +uaCity.population,
      "countryId": ukraineId,
      "regionId": region.id,
      "districtId": district?.id,
      "fullName": fullName,
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