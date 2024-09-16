import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./styles/SelfDeliveryModalContent.css";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import SelfDeliveryModalPointsList from "./SelfDeliveryModalPointsList";
import MyMap from "./UI/myMap/MyMap";
import { DEFAULT_INIT_MAP_COORDS, WIDTH_TO_SHOW_BOTH_SELF_DELIVERY_MODAL_COLS } from "../utils/consts";
import { MapProvider } from "react-map-gl";
import useGettingUserLocationCoords from "../hooks/useGettingUserLocationCoords";
import useWindowWidth from "../hooks/useWindowWidth";
import SelfDeliveryModalContentTabs from "./SelfDeliveryModalContentTabs";
import SelfDeliveryModalPoint from "./SelfDeliveryModalPoint";
import MarkerWithPopup from "./UI/myMap/MarkerWithPopup";
import Loader from "./UI/loader/Loader";
import _ from "lodash";

const SelfDeliveryModalContent = observer(() => {
  const { app } = useContext(Context);
  const windowWidth = useWindowWidth();

  const [selectedTab, setSelectedTab] = useState("pointsList"); // or "map"

  // supports "default" and "checkout-page" modal types
  const initialSelectedId = useMemo(() => {
    if (app.selfDeliveryModalType === "default") {
      return app.selfDeliveryModalDefaultSelectedPointId || null;
    } else if (app.selfDeliveryModalType === "checkout-page") {
      return app.selectedStorePickupPointIdValues?.[app.selfDeliveryModalSelectedPointValueId]?.value || null;
    }
    // eslint-disable-next-line
  }, [app.selfDeliveryModalType, app.selfDeliveryModalSelectedPointValueId]);

  const [selectedId, setSelectedId] = useState(initialSelectedId);
  
  const [coords, setCoords] = useState(DEFAULT_INIT_MAP_COORDS);
  const mapRef = useRef(null);

  useEffect(() => {
    if (selectedId) {
      // supports "default" and "checkout-page" modal types
      if (app.selfDeliveryModalType === "default") {
        app.setSelfDeliveryModalDefaultSelectedPointId(selectedId);
      } else if (app.selfDeliveryModalType === "checkout-page" && app.selfDeliveryModalSelectedPointValueId) {
        let nextValue = _.cloneDeep(app.selectedStorePickupPointIdValues); 
        if (nextValue) {
          let oldValue = nextValue?.[app.selfDeliveryModalSelectedPointValueId];
          if (oldValue) {
            oldValue.value = selectedId;
            oldValue.setter?.(selectedId);
          }
        }
    
        if (!_.isEqual(app.selectedStorePickupPointIdValues, nextValue)) {
          app.setSelectedStorePickupPointIdValues(nextValue);
        }
      }
    }
  }, [app, selectedId]);

  useGettingUserLocationCoords(setCoords);
  useEffect(() => {
    return () => {
      if (app.isVisibleSelfDeliveryModal) return;

      // clearing up our callback on the modal close
      app.setSelfDeliveryModalOnSelectCb(null);
    };
  }, [app]);

  const storePickupPoints = app.storePickupPoints?.filter(point => point.cityId === app.userLocation.id);

  function onSelect(id) {
    setSelectedId(id);
    app.selfDeliveryModalOnSelectCb?.();
  }

  function getMapMarkers() {
    let markers = [];
    for (let pickupPoint of storePickupPoints) {
      // using React.Fragment to put key there because if i do the same thing 
      // inside the marker component react throws an error "key is not a prop"
      markers.push(
        <React.Fragment key={pickupPoint.id}>
          <MarkerWithPopup
            markerId={pickupPoint.id}
            lng={pickupPoint.lng}
            lat={pickupPoint.lat}
            flyTo={mapRef.current?.flyTo}
            selectedMarkerId={selectedId}
            setSelectedMarkerId={onSelect}
            popupChildren={
              <SelfDeliveryModalPoint point={pickupPoint} isTelLink={true} className="popup-version" />
            }
          />
        </React.Fragment>
      );
    }

    return markers;
  }

  const selectedPoint = storePickupPoints
    ? storePickupPoints?.find(point => point.id === selectedId) || storePickupPoints[0]
    : null;

  if (selectedPoint && (selectedPoint?.lng !== coords.lng || selectedPoint?.lat !== coords.lat)) {
    setCoords({ lng: selectedPoint.lng, lat: selectedPoint.lat })
  };

  const isToShowBothChilds = windowWidth >= WIDTH_TO_SHOW_BOTH_SELF_DELIVERY_MODAL_COLS;

  // adding conditional rendering here to prevent the node remove error
  // using MapProvider to reference to the map we use here in the list component
  return (
    <div className="self-delivery-modal-content-wrap">
      {app.storePickupPoints.length && app.userLocation
        ? (
          <MapProvider key="self-delivery-modal-content-map-provider">
            <section className="self-delivery-modal-content">
              {!isToShowBothChilds &&
                <SelfDeliveryModalContentTabs
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                />
              }
              {(isToShowBothChilds || selectedTab === "pointsList") &&
                <SelfDeliveryModalPointsList
                  selectedId={selectedId}
                  setSelectedId={onSelect}
                  storePickupPoints={storePickupPoints}
                />
              }
              {(isToShowBothChilds || selectedTab === "map") &&
                <MyMap
                  lng={coords.lng}
                  lat={coords.lat}
                  zoom={15}
                  id="selfDeliveryMap"
                  children={getMapMarkers()}
                  ref={mapRef}
                />
              }
            </section>
          </MapProvider>
        )
        : (
          <Loader key="self-delivery-modal-loader" />
        )
      }
    </div>
  );
});

export default SelfDeliveryModalContent;
