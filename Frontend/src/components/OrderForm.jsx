import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
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

const OrderForm = () => {
  const { currentUser, selectedShop, createOrder, getMachineByShopId } =
    useAppContext();
  const { toast } = useToast();
  const [glassCount, setGlassCount] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);

  const machine = selectedShop
    ? getMachineByShopId(selectedShop.id)
    : undefined;
  const sugarcanesNeeded = calculateSugarcanesNeeded(glassCount);
  const hasEnoughBatteryForOrder = machine
    ? hasEnoughBattery(glassCount, machine.batteryPercentage)
    : true;

  const handleOrder = () => {
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

    setTimeout(() => {
      const orderId = createOrder(currentUser.id, selectedShop.id, glassCount);

      toast({
        title: "Order placed!",
        description: `Your order for ${glassCount} glass${
          glassCount > 1 ? "es" : ""
        } has been placed`,
      });

      setIsOrdering(false);
    }, 1500);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Glass className="h-5 w-5 text-primary" />
          Order Juice
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedShop ? (
          <>
            <div className="mb-4">
              <p className="text-sm font-medium">
                Selected Shop: {selectedShop.name}
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="glass-count">Number of Glasses</Label>
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

              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Sugarcane className="h-4 w-4 text-sugarcane" />
                    Sugarcane required:
                  </div>
                  <span className="font-semibold">{sugarcanesNeeded}</span>
                </div>

                {!hasEnoughBatteryForOrder && (
                  <div className="text-xs text-red-500 mt-1">
                    Warning: Low battery. The machine may not be able to
                    complete this order.
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                onClick={handleOrder}
                disabled={isOrdering || !selectedShop || glassCount < 1}
              >
                {isOrdering ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Please select a shop from the map to place an order
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderForm;
