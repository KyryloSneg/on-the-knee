import Map from 'react-map-gl';
import maplibregl from 'maplibre-gl';

const MyMap = ({ lng, lat, zoom, id = "" }) => {
  return (
    <Map 
      id={id}
      mapLib={maplibregl}
      initialViewState={{
        longitude: 16.62662018,
        latitude: 49.2125578,
        zoom: 14
      }}
      style={{ width: "800px", height: "800px" }}
      mapStyle="https://api.maptiler.com/maps/streets-v2/style.json?key=XESRWvK75vWTcOneFpZY"
    />
  );
}

export default MyMap;