import "./myMap.css";
import Map, { Marker, NavigationControl } from 'react-map-gl';
import maplibregl from 'maplibre-gl';

// children can contain markers, popups etc.
const MyMap = ({ lng = 30.4383398, lat = 50.4565494, zoom = 10, children }) => {
  // width and height properties we change in css (these in style prop we override mostly)
  return (
    <div className="my-map-wrapper" style={{ width: "620px", height: "620px" }}>
      <Map
        className="my-map"
        mapLib={maplibregl}
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: zoom
        }}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.REACT_APP_MAPLIBRE_API_KEY}`}
      >
        <Marker
          longitude={lng}
          latitude={lat}
        />
        {children}
        <NavigationControl position="top-left" />
      </Map>
    </div>
  );
}

export default MyMap;