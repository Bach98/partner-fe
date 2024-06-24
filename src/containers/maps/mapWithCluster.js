import React, { useState } from "react";
const { compose, withHandlers } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} = require("react-google-maps");
const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");

const MapWithAMarkerClusterer = compose(
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      markerClusterer.getMarkers()
    },
  }),
  withScriptjs,
  withGoogleMap
)(props => {
  const { marker, zoomValue, centerPoint } = props
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
  return (<GoogleMap
    defaultZoom={zoom}
    defaultCenter={center}
    ref={map => map && map.fitBounds(bounds)}
  >
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
      maxZoom={20}
    >
      {marker.map((marker, i) => (
        <MarkerWrapper
          key={i}
          marker={{
            position: { lat: marker.lat, lng: marker.lng }
          }}
          info={marker.info}
        />
      ))}
    </MarkerClusterer>
  </GoogleMap>)
});

const MarkerWrapper = (props) => {
  const [show, setShow] = useState(false);
  return (
    <Marker
      {...props.marker}
      onClick={e => setShow(true)}
    >
      {!!show && <InfoWindow onCloseClick={e => setShow(false)}>
        <div>{props.info}</div>
      </InfoWindow>}
    </Marker>
  )
}

export default MapWithAMarkerClusterer;