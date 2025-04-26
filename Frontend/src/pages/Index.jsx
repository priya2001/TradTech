import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import AuthForm from "../components/AuthForm";
import { SolarPanel } from "../components/Icons";
import { useAppContext } from "../lib/context";
import MapView from "../components/Map";
import bg from "../assets/sugarcane.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const { currentUser, shops, userLocation } = useAppContext();
  const [nearestShop, setNearestShop] = useState(null);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "customer") {
        navigate("/customer");
      } else if (currentUser.role === "shopkeeper") {
        navigate("/shopkeeper");
      } else if (currentUser.role === "admin") {
        navigate("/admin");
      }
    }
  }, [currentUser, navigate]);

  // Find the nearest shop
  useEffect(() => {
    if (!userLocation || shops.length === 0) return;

    const sortedShops = shops
      .filter((shop) => shop.isApproved)
      .sort((a, b) => {
        const distanceA = Math.hypot(
          userLocation.lat - a.location.lat,
          userLocation.lng - a.location.lng
        );
        const distanceB = Math.hypot(
          userLocation.lat - b.location.lat,
          userLocation.lng - b.location.lng
        );
        return distanceA - distanceB;
      });

    setNearestShop(sortedShops[0] || null);
  }, [shops, userLocation]);

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center"
    style={{ backgroundImage: `url(${bg})` }}>
      {/* Header */}
      <header className="py-8 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center flex items-center justify-center gap-2 text-black">
            <SolarPanel className="inline-block text-solar-light" />
            <span className="text-solar-light">Tradi</span>Tech
          </h1>
          <p className="text-lg text-center mt-4 max-w-md mx-auto text-black">
            The eco-friendly way to enjoy fresh sugarcane juice powered by solar
            energy.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Map Section */}
          <div className="flex justify-center">
            <MapView showOrderButton={false} />
          </div>

          {/* Right: Login & Register */}
          <div className="flex flex-col items-center justify-center">
            <Card className="w-full max-w-lg shadow-lg bg-white rounded-xl transform transition-all duration-300 hover:scale-105">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-center mb-6">
                  Login / Register
                </h2>
                <AuthForm />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Nearest Shop Section */}
        {nearestShop && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-center text-black">
              Next Nearest Shop
            </h3>
            <Card className="mt-4 p-4 mx-auto max-w-lg bg-white rounded-xl shadow-md">
              <CardContent className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold">{nearestShop.name}</h4>
                  <p className="text-sm text-gray-600">{nearestShop.address}</p>
                </div>
                <div className="text-sm bg-gray-200 px-3 py-1 rounded-full">
                  {nearestShop.rating}★
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} SolarJuice. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
