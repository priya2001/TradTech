import { useEffect, useState } from "react";
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
    shops,
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold mb-8">Shopkeeper Dashboard</h1>

        {userShop ? (
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-8">
              <Card className="shadow-xl rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-xl font-semibold">
                    <div className="flex items-center gap-3">
                      <Shop className="h-6 w-6 text-primary" />
                      {userShop.name}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-lg text-gray-600">Address</div>
                    <div className="font-medium text-gray-700">Dummy address</div>
                  </div>

                  <div className="mb-6">
                    <div className="text-lg text-gray-600">Rating</div>
                    <div className="font-semibold text-gray-700">4★</div>
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
              <Card className="h-full shadow-xl rounded-3xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                    <Glass className="h-6 w-6 text-primary" />
                    Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {shopOrders.length > 0 ? (
                    <div className="space-y-6 max-h-[700px] overflow-y-auto">
                      {shopOrders.map((order) => {
                        const sugarcanesNeeded = calculateSugarcanesNeeded(
                          order.glassCount
                        );

                        return (
                          <div key={order.id} className="p-6 border rounded-3xl shadow-md bg-white">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="font-medium text-lg">
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

                            <div className="flex items-center gap-6 mb-4">
                              <div className="flex items-center gap-2">
                                <Glass className="h-5 w-5 text-primary" />
                                <span>
                                  {order.glassCount} glass
                                  {order.glassCount > 1 ? "es" : ""}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Sugarcane className="h-5 w-5 text-sugarcane" />
                                <span>
                                  {sugarcanesNeeded} sugarcane
                                  {sugarcanesNeeded > 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>

                            {order.status === "pending" && (
                              <Button
                                size="md"
                                onClick={() => handleProcessOrder(order)}
                                className="w-full"
                              >
                                Process Order
                              </Button>
                            )}

                            {order.status === "processing" && (
                              <Button
                                size="md"
                                onClick={() => handleCompleteOrder(order)}
                                className="w-full"
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
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-3">
              Your shop is not approved.
            </h2>
          </div>
        )}
      </main>

      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-6 text-center text-base text-gray-600">
          &copy; {new Date().getFullYear()} SolarJuice. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Shopkeeper;
