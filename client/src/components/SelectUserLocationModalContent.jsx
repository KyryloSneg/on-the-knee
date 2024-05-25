import { useState } from "react";
import SelectUserLocationModalSearch from "./SelectUserLocationModalSearch";
import "./styles/SelectUserLocationModalContent.css";
import SelectUserLocationModalBigCities from "./SelectUserLocationModalBigCities";
import SelectUserLocationModalList from "./SelectUserLocationModalList";

const SelectUserLocationModalContent = () => {
  const [query, setQuery] = useState("");
  if (!app.allLocations.length) return <div />

  const allLocationsCopy = [...app.allLocations];
  let filteredCities = allLocationsCopy.filter(location => 
    location.name.toLowerCase().includes(query.toLowerCase().trim())
  );

  // sorting by name
  // filteredCities = filteredCities.sort((a, b) => a.name.localeCompare(b.name));

  // sorting by population (cities with more population are first in the list)
  filteredCities = filteredCities.sort((a, b) => b.population - a.population);

  const bigCities = allLocationsCopy
    .sort((a, b) => b.population - a.population)
    .slice(0, 6);

  return (
    <section className="select-user-location-modal-content">
      <SelectUserLocationModalSearch setQuery={setQuery} />
      <SelectUserLocationModalBigCities bigCities={bigCities} />
      <SelectUserLocationModalList cities={filteredCities} />
    </section>
  );
}

export default SelectUserLocationModalContent;
