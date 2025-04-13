import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAppContext } from "../lib/context";
import { calculateDistance } from "../lib/calculations";
import { useToast } from "../components/ui/use-toast";

const MapView = ({ showOrderButton = true }) => {
  const { shops, userLocation, selectedShop, setSelectedShop } =
    useAppContext();
  const { toast } = useToast();
  const [distances, setDistances] = useState({});

  useEffect(() => {
    if (!userLocation) return;

    const newDistances = {};
    shops.forEach((shop) => {
      if (shop.isApproved) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          shop.location.lat,
          shop.location.lng
        );
        newDistances[shop.id] = distance;
      }
    });

    setDistances(newDistances);
  }, [userLocation, shops]);

  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
    toast({
      title: "Shop Selected",
      description: `You've selected ${shop.name}`,
    });
  };

  const getDirections = () => {
    if (!selectedShop || !userLocation) return;

    toast({
      title: "Directions",
      description: `Directions to ${selectedShop.name} (${Math.round(
        distances[selectedShop.id]
      )} meters)`,
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Nearby Shops</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60 bg-gray-200 mb-4 rounded-md overflow-hidden">
          <img
            src="/assets/map.png"
            alt="Map showing nearby shops"
            className="w-full h-full object-cover"
          />
        </div>

        {userLocation && (
          <div className="text-center p-4 bg-gray-100 rounded-md">
            <div className="text-sm">
              Your location: {userLocation.lat.toFixed(4)},{" "}
              {userLocation.lng.toFixed(4)}
            </div>

            {selectedShop && (
              <div className="mt-4 p-2 bg-white rounded-md shadow-sm">
                <div className="text-sm font-medium text-primary">
                  {selectedShop.name}
                </div>
                <div className="text-xs">
                  {Math.round(distances[selectedShop.id])} meters away
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto mt-4">
          {shops
            .filter((shop) => shop.isApproved)
            .sort(
              (a, b) =>
                (distances[a.id] || Infinity) - (distances[b.id] || Infinity)
            )
            .map((shop) => (
              <div
                key={shop.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedShop?.id === shop.id
                    ? "bg-primary/10 border border-primary/30"
                    : "bg-gray-50 hover:bg-gray-100 border border-transparent"
                }`}
                onClick={() => handleShopSelect(shop)}
                role="button"
                aria-label={`Select ${shop.name}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{shop.name}</div>
                    <div className="text-xs text-gray-500">{shop.address}</div>
                  </div>
                  {distances[shop.id] && (
                    <div className="text-sm">
                      {Math.round(distances[shop.id])}m
                    </div>
                  )}
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
