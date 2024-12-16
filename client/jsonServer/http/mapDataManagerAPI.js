const { default: axios } = require("axios")

// https://api.opencagedata.com/geocode/v1/json?key=&q=56%20Peremohy%20Ave,%20Kyiv,%20UA&pretty=1&no_annotations=1
async function getLocationCoords(country, region, district, city, street, houseNumber) {
  // 56 Peremohy Ave, Kyiv, UA
  let query;
  if (district && region) {
    query = `${houseNumber} ${street}, ${city}, ${district}, ${region}, ${country}`;
  } else {
    query = `${houseNumber} ${street}, ${city}, ${country}`;
  }

  // idk why but adding district and region for fetching Brovary's coords don't work properly 
  // (lat and lng are wrong at all: { confidence: 1 })
  if (city === "Brovary") {
    query = `${houseNumber} ${street}, ${city}, ${country}`;
  }
  
  let response;
  try {
    const { data } = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?key=${process.env.MOCK_SERVER_OPENCAGE_API_KEY}&q=${query}&pretty=1&no_annotations=1`
    );

    response = data;
  } catch(e) {
    console.log(e.message);
  }

  const { lat, lng } = response?.results[0]?.geometry || {};
  return { lat, lng };
}

module.exports = {
  getLocationCoords,
}