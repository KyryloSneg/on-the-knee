import { useState } from "react";
import SelectUserLocationModalSearch from "./SelectUserLocationModalSearch";
import "./styles/SelectUserLocationModalContent.css";
import SelectUserLocationModalBigCities from "./SelectUserLocationModalBigCities";
import SelectUserLocationModalList from "./SelectUserLocationModalList";

const SelectUserLocationModalContent = () => {
  const [query, setQuery] = useState("");
  // TODO: state "cities"
  const filteredCities = [];
  const bigCities = [];

  return (
    <section className="select-user-location-modal-content">
      <SelectUserLocationModalSearch setQuery={setQuery} />
      <SelectUserLocationModalBigCities bigCities={bigCities} />
      <SelectUserLocationModalList cities={filteredCities} />
    </section>
  );
}

export default SelectUserLocationModalContent;
