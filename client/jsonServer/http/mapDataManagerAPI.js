const { default: axios } = require("axios")

async function getLocationCoords(country, region, district, city, street, houseNumber) {
  let location = [country, region, district, city, street, houseNumber];
  location = location.join(" ");

  let response;
  try {
    const { data } = await axios.get("https://www.mapquestapi.com/geocoding/v1/address", {
      "params": {
        "key": process.env.MAPQUERY_API_KEY,
        "location": location,
      }
    });

    response = data;
  } catch(e) {
    console.log(e.message);
  }

  const { lat, lng } = response?.results[0].locations[0].displayLatLng || {};
  return { lat, lng };
}

module.exports = {
  getLocationCoords,
}