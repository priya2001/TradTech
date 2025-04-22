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
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Glass className="h-6 w-6 text-primary" />
          Order Juice
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedShop ? (
          <>
            <div className="mb-4">
              <p className="text-base font-semibold">
                Selected Shop: {selectedShop.name}
              </p>
            </div>

            <div className="space-y-5 text-base">
              {/* Glass size */}
              <div className="space-y-2">
                <Label htmlFor="glass-size" className="text-base font-semibold">
                  Glass Size (ml)
                </Label>
                <div className="flex gap-2">
                  {[250, 500].map((size) => (
                    <Button
                      key={size}
                      variant={glassSize === size ? "default" : "outline"}
                      onClick={() => setGlassSize(size)}
                    >
                      {size} ml
                    </Button>
                  ))}
                </div>
              </div>

              {/* Glass quantity */}
              <div className="space-y-2">
                <Label htmlFor="glass-count" className="text-base font-semibold">
                  Number of Glasses
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setGlassCount((prev) => Math.max(1, prev - 1))
                    }
                    disabled={glassCount <= 1}
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
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGlassCount((prev) => prev + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Sugarcane info */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-base font-semibold">
                    <Sugarcane className="h-5 w-5 text-sugarcane" />
                    Sugarcane required:
                  </div>
                  <span className="font-semibold">{sugarcanesNeeded}</span>
                </div>

                {!hasEnoughBatteryForOrder && (
                  <div className="text-sm text-red-500 mt-1 font-medium">
                    Warning: Low battery. The machine may not be able to
                    complete this order.
                  </div>
                )}
              </div>

              {/* Payment method */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  Payment Method
                </Label>
                <div className="flex gap-2">
                  {["cash", "card", "online"].map((method) => (
                    <Button
                      key={method}
                      variant={paymentMethod === method ? "default" : "outline"}
                      onClick={() => setPaymentMethod(method)}
                    >
                      {method}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <Button
                className="w-full text-lg"
                onClick={handleOrder}
                disabled={isOrdering || !selectedShop || glassCount < 1}
              >
                {isOrdering ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-gray-500 text-base">
            Please select a shop from the map to place an order
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderForm;
