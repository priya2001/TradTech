import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAppContext } from "../lib/context";
import { calculateDistance } from "../lib/calculations";
import { useToast } from "../components/ui/use-toast";

// Dynamic import for Google Maps to work with Vite
const { LoadScript, GoogleMap, Marker, DirectionsRenderer } = await import('@react-google-maps/api');

const MapView = ({ 
  showOrderButton = true, 
  nearestShops = [], 
  showOnlyNearest = false 
}) => {
  const { shops, selectedShop, setSelectedShop ,setShops} = useAppContext();
  const [userLocation, setUserLocation] = useState(null);
  const { toast } = useToast();
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  // const [shops, setShops] = useState();
  const mapRef = useRef(null);

  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = userLocation || { 
    lat: 25.490893, 
    lng: 81.863643 // Default to Bangalore
  };

  const displayShops = showOnlyNearest && nearestShops.length > 0 
    ? nearestShops 
    : shops.filter(shop => shop.isApproved);

  const handleLoad = (map) => {
    mapRef.current = map;
    setMapLoaded(true);
  };

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
    toast({
      title: "Shop Selected",
      description: `You've selected ${shop.name}`,
    });
  };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(pos);
          setMapCenter(pos);
          // In real app, call your API here with pos.lat, pos.lng
          setShops(mockShops);
        },
        () => {
          console.log("Geolocation blocked, using default location");
          setShops(mockShops);
        }
      );
    }
  }, []);

  const getDirections = () => {
    console.log("Getting directions...");
    console.log("User Location:", userLocation);
    console.log("Selected Shop:", selectedShop);
    if (!selectedShop || !userLocation || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: userLocation,
        destination: { 
          lat: selectedShop.location.lat, 
          lng: selectedShop.location.lng 
        },
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          toast({
            title: "Directions",
            description: `Route to ${selectedShop.name}`,
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
              {/* User Location Marker */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }}
                />
              )}

              {/* Shop Markers */}
              {mapLoaded && displayShops.map((shop) => (
                <Marker
                  key={shop.id}
                  position={{ 
                    lat: shop.location.lat, 
                    lng: shop.location.lng 
                  }}
                  icon={{
                    url: selectedShop?.id === shop.id 
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
          {displayShops.map((shop) => (
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
                  <div className="font-medium">{shop.name}</div>
                  <div className="text-xs text-gray-500">{shop.address}</div>
                </div>
                <div className="text-sm">
                  {Math.round(calculateDistance(
                    userLocation?.lat,
                    userLocation?.lng,
                    shop.location.lat,
                    shop.location.lng
                  ))}m
                </div>
              </div>
              <div className="flex items-center mt-1">
                <div className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  Rating: {shop.rating}★
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