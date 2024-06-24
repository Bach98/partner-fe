import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
// import {
//   ShopFilled
// } from '@ant-design/icons';
const MyMapComponent = withScriptjs(withGoogleMap(props => {
  const { marker, zoomValue, centerPoint, onClick } = props
  let center = centerPoint
    ? centerPoint
    : {
      lat: 10.800775217826915,
      lng: 106.73118129372597
    };
  let zoom = zoomValue
    ? zoomValue
    : 16;
  const bounds = new window.google.maps.LatLngBounds();
  marker.map((child) =>
    bounds.extend(new window.google.maps.LatLng(child.lat, child.lng))
  )
  return (
    <GoogleMap
      zoom={zoom}
      center={center}
      onClick={e => onClick(e)}
      ref={map => map && map.fitBounds(bounds)}
    >
      {
        (marker && marker.length) && marker.map((marker, i) => {
          return <Marker
            key={i}
            position={marker}
          />
        })
      }
    </GoogleMap>
  )
}));

export default MyMapComponent;