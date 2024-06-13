import "./styles/SelfDeliveryModalPointsList.css";
import { useRef, useState } from 'react';
import DeleteInputContent from './UI/deleteInputContent/DeleteInputContent';
import SelfDeliveryModalPoint from "./SelfDeliveryModalPoint";
import CustomScrollbar from "./UI/customScrollbar/CustomScrollbar";
import { useMap } from "react-map-gl";

const SelfDeliveryModalPointsList = ({ selectedId, setSelectedId, storePickupPoints }) => {
  const { selfDeliveryMap } = useMap();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const filteredPoints = storePickupPoints.filter(
    point => point.fullName.toLowerCase().includes(query.toLowerCase())
  );

  function onClick() {
    setQuery("");
    inputRef.current?.focus();
  }

  function onChange(e) {
    setQuery(e.target.value);
  }

  function onChangeCoords(lng, lat) {
    // changing map's lng and lat (and setting zoom level to 15)
    // (using ?. is mandatory here)
    selfDeliveryMap?.flyTo({ center: [lng, lat], zoom: 15 });
  }

  return (
    <section className="self-delivery-modal-points-section">
      <div className="self-delivery-modal-points-search">
        <input
          type="search"
          placeholder="Street name"
          aria-label="Search street with self delivery pickup point"
          autoComplete="off"
          value={query}
          onChange={onChange}
          ref={inputRef}
        />
        <DeleteInputContent onClick={onClick} />
      </div>
      {filteredPoints.length
        ? (
          <CustomScrollbar
            className="self-delivery-modal-scrollbar"
            isRect={true}
            children={
              <ul className="self-delivery-modal-points-list">
                {filteredPoints.map(point =>
                  <li key={point.id}>
                    <SelfDeliveryModalPoint
                      point={point}
                      selectedId={selectedId}
                      setSelectedId={setSelectedId}
                      changeMapCoords={onChangeCoords}
                    />
                  </li>
                )}
              </ul>
            }
          />
        )
        : (
          <p className="self-delivery-modal-no-points">
            No such store pickup points {":("}
          </p>
        )
      }
    </section>
  );
}

export default SelfDeliveryModalPointsList;
