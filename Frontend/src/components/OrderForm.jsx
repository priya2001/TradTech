import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Glass, Sugarcane } from "../components/Icons";
import { useAppContext } from "../lib/context.jsx";
import {
  calculateSugarcanesNeeded,
  hasEnoughBattery,
} from "@/lib/calculations";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const OrderForm = () => {
  const { currentUser, selectedShop, setSelectedShop } = useAppContext();
  const { toast } = useToast();

  const [glassCount, setGlassCount] = useState(1);
  const [glassSize, setGlassSize] = useState(250);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isOrdering, setIsOrdering] = useState(false);

  const machine = selectedShop ? selectedShop.machine : undefined;

  const sugarcanesNeeded = calculateSugarcanesNeeded(glassCount);
  const hasEnoughBatteryForOrder = machine
    ? hasEnoughBattery(glassCount, machine.batteryPercentage)
    : true;

  const handleOrder = async () => {
    if (!currentUser || !selectedShop) {
      toast({
        title: "Cannot place order",
        description: "Please login and select a shop first",
        variant: "destructive",
      });
      return;
    }

    if (!hasEnoughBatteryForOrder) {
      toast({
        title: "Low battery warning",
        description:
          "The shop's machine doesn't have enough battery for this order",
        variant: "destructive",
      });
      return;
    }

    setIsOrdering(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/customers/order-juice",
        {
          shopId: selectedShop.id,
          glassSize,
          quantity: glassCount,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSelectedShop(null);
      toast({
        title: "Order placed!",
        description: `Your order for ${glassCount} glass${glassCount > 1 ? "es" : ""} has been placed`,
      });
    } catch (error) {
      console.error("Order failed:", error.response?.data || error.message);
      toast({
        title: "Order failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gray-50 p-6 rounded-md shadow-[0_0_15px_0_rgba(34,197,94,0.3)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl flex items-center gap-2">
          <Glass className="h-8 w-8 text-primary" />
          Order Juice
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedShop ? (
          <>
            <div className="mb-6">
              <p className="text-2xl font-semibold">
                Selected Shop: {selectedShop.name}
              </p>
            </div>

            <div className="space-y-6 text-2xl">
              {/* Glass size */}
              <div className="space-y-4">
                <Label htmlFor="glass-size" className="text-2xl font-semibold">
                  Glass Size (ml)
                </Label>
                <div className="flex gap-4">
                  {[250, 500].map((size) => (
                    <Button
                      key={size}
                      variant={glassSize === size ? "default" : "outline"}
                      onClick={() => setGlassSize(size)}
                      className="text-2xl"
                    >
                      {size} ml
                    </Button>
                  ))}
                </div>
              </div>

              {/* Glass quantity */}
              <div className="space-y-4">
                <Label htmlFor="glass-count" className="text-2xl font-semibold">
                  Number of Glasses
                </Label>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() =>
                      setGlassCount((prev) => Math.max(1, prev - 1))
                    }
                    disabled={glassCount <= 1}
                    className="text-2xl"
                  >
                    -
                  </Button>
                  <Input
                    id="glass-count"
                    type="number"
                    min="1"
                    value={glassCount}
                    onChange={(e) =>
                      setGlassCount(parseInt(e.target.value) || 1)
                    }
                    className="text-2xl"
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setGlassCount((prev) => prev + 1)}
                    className="text-2xl"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Sugarcane info */}
              <div className="bg-gray-50 p-6 rounded-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-2xl font-semibold">
                    <Sugarcane className="h-6 w-6 text-sugarcane" />
                    Sugarcane required:
                  </div>
                  <span className="font-semibold text-2xl">{sugarcanesNeeded}</span>
                </div>

                {!hasEnoughBatteryForOrder && (
                  <div className="text-lg text-red-500 mt-2 font-medium">
                    Warning: Low battery. The machine may not be able to
                    complete this order.
                  </div>
                )}
              </div>

              {/* Payment method */}
              <div className="space-y-4">
                <Label className="text-2xl font-semibold">
                  Payment Method
                </Label>
                <div className="flex gap-4">
                  {["cash", "card", "online"].map((method) => (
                    <Button
                      key={method}
                      variant={paymentMethod === method ? "default" : "outline"}
                      onClick={() => setPaymentMethod(method)}
                      className="text-2xl"
                    >
                      {method}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <Button
                className="w-full text-3xl"
                onClick={handleOrder}
                disabled={isOrdering || !selectedShop || glassCount < 1}
              >
                {isOrdering ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 text-2xl">
            Please select a shop from the map to place an order
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderForm;
