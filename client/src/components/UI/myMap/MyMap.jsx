import "./myMap.css";
import Map, { NavigationControl } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import MarkerWithPopup from "./MarkerWithPopup";
import { forwardRef } from "react";

// children can contain markers, popups etc.
const MyMap = forwardRef(({ lng = 0, lat = 0, zoom = 0, id = "", children, ...props }, ref) => {
  const initViewState = {
    longitude: lng,
    latitude: lat,
    zoom: zoom
  };

  return (
    <Map
      mapLib={maplibregl}
      initialViewState={initViewState}
      mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.REACT_APP_MAPLIBRE_API_KEY}`}
      id={id}
      ref={ref}
      {...props}
    >
      {children}
      <NavigationControl position="top-left" />
    </Map>
  );
});

export default MyMap;