import { useState } from "react";
import SelectUserLocationModalSearch from "./SelectUserLocationModalSearch";
import "./styles/SelectUserLocationModalContent.css";
import SelectUserLocationModalBigCities from "./SelectUserLocationModalBigCities";
import SelectUserLocationModalList from "./SelectUserLocationModalList";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import CustomScrollbar from "./UI/customScrollbar/CustomScrollbar";

const SelectUserLocationModalContent = () => {
  const [query, setQuery] = useState("");

  // THIS FRICKING CODE ROW HAS DESTROYED ALL MY BRAIN CELLS BECAUSE IT RANDOMLY WAS CAUSING DOMEXCEPTION ERROR ON RENDERING THE MODAL
  // (i still don't know why)
  // if (!app.allLocations.length || !app.userLocation) return <div />

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

  // using "key" prop to prevent weird DOMException
  return (
    <section className="select-user-location-modal-content" key="select-user-location-modal-content">
      <SelectUserLocationModalSearch
        query={query}
        setQuery={setQuery}
      />
      <SelectUserLocationModalBigCities bigCities={bigCities} />
      {/* i really don't know why i can't use conditional rendering in <SelectUserLocationModalList /> 
          (React throws the DOMException error whe i do that (idk why))
      */}
      {!!query.trim().length
        ? (
          filteredCities.length
            ? (
              <CustomScrollbar
                children={
                  <SelectUserLocationModalList cities={filteredCities} />
                }
                key="select-user-location-modal-list-scrollbar"
              />
            )
            : (
              <p className="select-user-location-modal-no-results" key="select-user-location-modal-no-results">
                We haven't found any results
              </p>
            )
        )
        : (
          <div className="user-location-modal-list-placeholder" key="user-location-modal-list-placeholder">
            Type your city name
          </div>
        )
      }
    </section>
  );
}

export default SelectUserLocationModalContent;
