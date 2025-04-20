import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAppContext } from "../lib/context";
import { calculateDistance } from "../lib/calculations";
import { useToast } from "../components/ui/use-toast";

// Dynamic import for Google Maps to work with Vite
const { LoadScript, GoogleMap, Marker, DirectionsRenderer } = await import(
  "@react-google-maps/api"
);

const MapView = ({
  showOrderButton = true,
  nearestShops = [],
  showOnlyNearest = false,
}) => {
  const { shops, selectedShop, setSelectedShop, setShops, locations } =
    useAppContext();
  const [userLocation, setUserLocation] = useState(null);
  const { toast } = useToast();
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = userLocation || {
    lat: 25.490893,
    lng: 81.863643,
  };

  const handleLoad = (map) => {
    mapRef.current = map;
    setMapLoaded(true);
  };

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
    toast({
      title: "Shop Selected",
      description: `You've selected ${shop.shopName}`,
    });
  };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log(pos);
          setUserLocation(pos);
        },
        () => {
          console.log("Geolocation blocked, using default location");
        }
      );
    }
  }, []);

  const allShops = locations?.data?.shops || [];
// console.log(allShops)
  const getLatLng = (shop) => ({
    lat: shop.location.coordinates[0],
    lng: shop.location.coordinates[1],
  });

  const getDirections = () => {
    if (!selectedShop || !userLocation || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: userLocation,
        destination: getLatLng(selectedShop),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          toast({
            title: "Directions",
            description: `Route to ${selectedShop.shopName}`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not calculate directions",
          });
        }
      }
    );
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {showOnlyNearest ? "Nearest Shops" : "Nearby Shops"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-md overflow-hidden">
          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            onLoad={() => setMapLoaded(true)}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={14}
              onLoad={handleLoad}
            >
              {/* User Marker */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }}
                />
              )}

              {/* Shop Markers */}
              {mapLoaded &&
                allShops.map((shop) => (
                  <Marker
                    key={shop.id}
                    position={getLatLng(shop)}
                    icon={{
                      url:
                        selectedShop?.id === shop.id
                          ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                          : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    }}
                    onClick={() => handleShopSelect(shop)}
                  />
                ))}

              {/* Directions */}
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Shops List */}
        <div className="space-y-2 max-h-60 overflow-y-auto mt-4">
          {allShops.map((shop) => (
            <div
              key={shop.id}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                selectedShop?.id === shop.id
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-gray-50 hover:bg-gray-100 border border-transparent"
              }`}
              onClick={() => handleShopSelect(shop)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{shop.shopName}</div>
                  <div className="text-xs text-gray-500">
                    {shop?.location?.address}
                  </div>
                </div>
                <div className="text-sm">
                  {userLocation
                    ? Math.round(
                        calculateDistance(
                          userLocation.lat,
                          userLocation.lng,
                          shop.location.coordinates[0],
                          shop.location.coordinates[1]
                        )
                      ) + "m"
                    : "N/A"}
                </div>
              </div>
              <div className="flex items-center mt-1">
                <div className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  {shop?.address?.location?.address}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedShop && (
          <div className="flex flex-col space-y-2 mt-4">
            <Button className="w-full" onClick={getDirections}>
              Get Directions
            </Button>
            {showOrderButton && (
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Order Juice
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapView;
