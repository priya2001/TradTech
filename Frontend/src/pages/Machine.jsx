import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Battery,
  Fan,
  Lightbulb,
  PaymentMachine,
  SolarPanel,
} from "../components/Icons";
import { useAppContext } from "../lib/context";
import {
  calculateMaxGlassesWithBattery,
  calculateChargingTime,
} from "../lib/calculations";
import BatteryDisplay from "../components/BatteryDisplay";
import VerticalSlider from "../components/VerticalSlider";
import { useIsMobile } from "../hooks/use-mobile";

const Machine = () => {
  const navigate = useNavigate();
  const shopId = "1";
  const { currentUser, getShopById, getMachineByShopId, updateMachine } =
    useAppContext();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    } else if (currentUser.role !== "shopkeeper") {
      navigate(`/${currentUser.role}`);
    }

    if (!shopId) {
      navigate("/shopkeeper");
    }
  }, [currentUser, navigate, shopId]);

  if (!currentUser || currentUser.role !== "shopkeeper" || !shopId) {
    return null;
  }

  const shop = getShopById(shopId);
  const machine = shop ? getMachineByShopId("1") : undefined;

  if (!shop || !machine) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Machine not found</h1>
          <Button onClick={() => navigate("/shopkeeper")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleSpeedChange = (speed) => {
    updateMachine(machine.id, { speed });
  };

  const toggleCharging = () => {
    updateMachine(machine.id, { isCharging: !machine.isCharging });
  };

  const togglePaymentMachine = () => {
    updateMachine(machine.id, {
      isPaymentMachineOn: !machine.isPaymentMachineOn,
    });
  };

  const toggleLight = () => {
    updateMachine(machine.id, { isLightOn: !machine.isLightOn });
  };

  const cycleFanSpeed = () => {
    const speeds = ["off", "low", "medium", "high"];
    const currentIndex = speeds.indexOf(machine.fanSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    updateMachine(machine.id, { fanSpeed: speeds[nextIndex] });
  };

  const maxGlasses = calculateMaxGlassesWithBattery(machine.batteryPercentage);
  const hoursToFullCharge = machine.isCharging
    ? calculateChargingTime(machine.batteryPercentage, machine.solarEfficiency)
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2">
      <div className="machine-container max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-lg font-bold">{shop.name} - Machine Control</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/shopkeeper")}
            >
              Back
            </Button>
          </div>
          <div className="text-sm opacity-80">{shop.address}</div>
        </div>

        <div className="p-4">
          <div className={`${!isMobile ? "md:flex md:gap-6" : ""}`}>
            <div className={`${!isMobile ? "md:w-1/3" : ""} mb-6`}>
              <BatteryDisplay
                batteryPercentage={machine.batteryPercentage}
                isCharging={machine.isCharging}
                solarEfficiency={machine.solarEfficiency}
                isPaymentMachineOn={machine.isPaymentMachineOn}
                isLightOn={machine.isLightOn}
                fanSpeed={machine.fanSpeed}
              />
            </div>

            <div
              className={`${
                !isMobile ? "md:w-1/3" : ""
              } my-6 flex justify-center`}
            >
              <VerticalSlider value={machine.speed} onChange={handleSpeedChange} />
            </div>

            <div className={`${!isMobile ? "md:w-1/3" : ""}`}>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Card className="rounded-lg shadow-md">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SolarPanel className="h-5 w-5 text-solar" />
                      <span>Solar Charging</span>
                    </div>
                    <Button
                      variant={machine.isCharging ? "default" : "outline"}
                      size="sm"
                      onClick={toggleCharging}
                    >
                      {machine.isCharging ? "ON" : "OFF"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="rounded-lg shadow-md">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PaymentMachine className="h-5 w-5 text-primary" />
                      <span>Payment Machine</span>
                    </div>
                    <Button
                      variant={machine.isPaymentMachineOn ? "default" : "outline"}
                      size="sm"
                      onClick={togglePaymentMachine}
                    >
                      {machine.isPaymentMachineOn ? "ON" : "OFF"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="rounded-lg shadow-md">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-solar" />
                      <span>Light</span>
                    </div>
                    <Button
                      variant={machine.isLightOn ? "default" : "outline"}
                      size="sm"
                      onClick={toggleLight}
                    >
                      {machine.isLightOn ? "ON" : "OFF"}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="rounded-lg shadow-md">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Fan
                        className={`h-5 w-5 ${
                          machine.fanSpeed !== "off"
                            ? "animate-spin-slow text-primary"
                            : "text-gray-400"
                        }`}
                      />
                      <span>Fan</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={cycleFanSpeed}
                      className={
                        machine.fanSpeed !== "off" ? "bg-primary/10" : ""
                      }
                    >
                      {machine.fanSpeed.toUpperCase()}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Machine Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg shadow-md">
                <div className="text-sm text-gray-500">Max Glasses</div>
                <div className="text-xl font-bold">{maxGlasses}</div>
                <div className="text-xs text-gray-400">With current battery</div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg shadow-md">
                <div className="text-sm text-gray-500">Charging Time</div>
                <div className="text-xl font-bold">
                  {machine.isCharging
                    ? hoursToFullCharge < 1
                      ? `${Math.round(hoursToFullCharge * 60)}m`
                      : `${hoursToFullCharge.toFixed(1)}h`
                    : "Disconnected"}
                </div>
                <div className="text-xs text-gray-400">To full battery</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Machine;
