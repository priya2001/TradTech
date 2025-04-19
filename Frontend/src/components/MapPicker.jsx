// MapPicker.jsx
import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 28.6139, // Default to Delhi
  lng: 77.209,
};

const MapPicker = ({ onLocationSelect }) => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // replace with actual key
    libraries: ["places"],
  });

  const handleMapClick = useCallback(
    async (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      setMarkerPosition({ lat, lng });

      // Reverse Geocode to get address
      const geocodeRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await geocodeRes.json();

      const address =
        data?.results?.[0]?.formatted_address || "Address not found";

      onLocationSelect({ lat, lng, address });
    },
    [onLocationSelect]
  );

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={10}
      onClick={handleMapClick}
    >
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  );
};

export default MapPicker;
