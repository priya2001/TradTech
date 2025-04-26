import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BatteryDisplay from "../components/BatteryDisplay";
import MachineControl from "../components/MachineControl";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Glass, Sugarcane, Shop } from "../components/Icons";
import { useAppContext } from "../lib/context";
import { calculateSugarcanesNeeded } from "../lib/calculations";
import { useToast } from "../components/ui/use-toast";

const Shopkeeper = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentUser,
    orders,
    updateOrderStatus,
    machines,
    updateMachine,
  } = useAppContext();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    } else if (currentUser.role !== "shopkeeper") {
      navigate(`/${currentUser.role}`);
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "shopkeeper") {
    return null;
  }

  const userShop = currentUser.data.shopkeeper;
  const machine = userShop && machines.find((m) => m.shopId === '1');

  const shopOrders = userShop
    ? orders
        .filter((order) => order.shopId === 1)
        .sort((a, b) => b.timestamp - a.timestamp)
    : [];

  const handleProcessOrder = (order) => {
    updateOrderStatus(order.id, "processing");
    toast({
      title: "Order status updated",
      description: `Order #${order.id.slice(-5)} is now being processed`,
    });
  };

  const handleCompleteOrder = (order) => {
    updateOrderStatus(order.id, "completed");
    toast({
      title: "Order completed",
      description: `Order #${order.id.slice(-5)} has been completed`,
    });
  };

  const goToMachineDetails = () => {
    if (userShop) {
      navigate(`/machine/${'1'}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[url('/bamboo-bg.png')] bg-cover bg-no-repeat backdrop-blur-sm">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-4xl font-extrabold text-green-900 mb-10 text-center">🍃 Shopkeeper Dashboard</h1>

        {userShop ? (
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-7 space-y-8">
              <Card className="bg-white/90 shadow-[0_0_25px_0_rgba(34,197,94,0.5)] rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-2xl font-bold text-green-900">
                    <div className="flex items-center gap-3">
                      <Shop className="h-6 w-6 text-green-700" />
                      {userShop.name}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-lg text-gray-600">Address</div>
                    <div className="font-medium text-gray-700">123 Green Street, Nature City</div>
                  </div>

                  <div className="mb-6">
                    <div className="text-lg text-gray-600">Rating</div>
                    <div className="font-semibold text-green-700">4★</div>
                  </div>
                </CardContent>
              </Card>

              {machine && (
                <>
                  <MachineControl
                    machine={machine}
                    updateMachine={updateMachine}
                    onViewDetails={goToMachineDetails}
                  />

                  <BatteryDisplay
                    batteryPercentage={machine.batteryPercentage}
                    isCharging={machine.isCharging}
                    solarEfficiency={machine.solarEfficiency}
                    isPaymentMachineOn={machine.isPaymentMachineOn}
                    isLightOn={machine.isLightOn}
                    fanSpeed={machine.fanSpeed}
                  />
                </>
              )}
            </div>

            <div className="md:col-span-5">
              <Card className="h-full bg-white/90 shadow-xl rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-green-900">
                    <Glass className="h-6 w-6 text-green-700" />
                    Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {shopOrders.length > 0 ? (
                    <div className="space-y-6 max-h-[700px] overflow-y-auto">
                      {shopOrders.map((order) => {
                        const sugarcanesNeeded = calculateSugarcanesNeeded(order.glassCount);

                        return (
                          <div key={order.id} className="p-6 rounded-3xl shadow-sm bg-white/95 border border-gray-100 transition-transform hover:scale-[1.01]">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="font-medium text-lg text-green-800">
                                  Order #{order.id.slice(-5)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(order.timestamp).toLocaleString()}
                                </div>
                              </div>
                              <Badge
                                variant={
                                  order.status === "completed"
                                    ? "default"
                                    : order.status === "processing"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {order.status}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-6 mb-4 text-green-800">
                              <div className="flex items-center gap-2">
                                <Glass className="h-5 w-5 text-green-600" />
                                <span>
                                  {order.glassCount} glass{order.glassCount > 1 ? "es" : ""}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Sugarcane className="h-5 w-5 text-green-700" />
                                <span>
                                  {sugarcanesNeeded} sugarcane{sugarcanesNeeded > 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>

                            {order.status === "pending" && (
                              <Button
                                size="md"
                                onClick={() => handleProcessOrder(order)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                              >
                                Process Order
                              </Button>
                            )}

                            {order.status === "processing" && (
                              <Button
                                size="md"
                                onClick={() => handleCompleteOrder(order)}
                                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold"
                              >
                                Mark as Completed
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No orders yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-green-700">
            <h2 className="text-xl font-semibold mb-3">Your shop is not approved.</h2>
          </div>
        )}
      </main>

      <footer className="bg-white/80 py-6 border-t border-green-200">
        <div className="container mx-auto px-6 text-center text-base text-gray-600">
          &copy; {new Date().getFullYear()} SolarJuice. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Shopkeeper;