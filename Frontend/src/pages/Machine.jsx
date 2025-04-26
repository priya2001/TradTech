import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
          <h1 className="text-3xl font-bold mb-4">Machine not found</h1>
          <Button onClick={() => navigate("/shopkeeper")} className="text-2xl">
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
<div className="flex items-center justify-center min-h-screen bg-gray-100 py-6 px-4">
  <div className="w-full max-w-6xl bg-white rounded-lg shadow-[0_4px_20px_rgba(34,197,94,0.3)] overflow-hidden">
    <div className="bg-primary text-primary-foreground p-6 rounded-t-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{shop.name} - Machine Control</h1>
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate("/shopkeeper")}
          className="text-xl"
        >
          Back
        </Button>
      </div>
      <div className="text-xl opacity-80">{shop.address}</div>
    </div>

    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        {/* Battery Section */}
        <div className="md:w-1/3">
          <BatteryDisplay
            batteryPercentage={machine.batteryPercentage}
            isCharging={machine.isCharging}
            solarEfficiency={machine.solarEfficiency}
            isPaymentMachineOn={machine.isPaymentMachineOn}
            isLightOn={machine.isLightOn}
            fanSpeed={machine.fanSpeed}
          />
        </div>

        {/* Slider Section */}
        <div className="md:w-1/3 flex justify-center items-center">
          <VerticalSlider value={machine.speed} onChange={handleSpeedChange} />
        </div>

        {/* Control Cards Section */}
        <div className="md:w-1/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Solar Charging */}
            <Card className="rounded-lg shadow-md border hover:shadow-lg transition min-h-[120px]">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-lg">
                  <SolarPanel className="h-5 w-5 text-solar" />
                  <span>Solar</span>
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

            {/* Payment Machine */}
            <Card className="rounded-lg shadow-md border hover:shadow-lg transition min-h-[120px]">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-lg">
                  <PaymentMachine className="h-5 w-5 text-primary" />
                  <span>Payment</span>
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

            {/* Light */}
            <Card className="rounded-lg shadow-md border hover:shadow-lg transition min-h-[120px]">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-lg">
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

            {/* Fan */}
            <Card className="rounded-lg shadow-md border hover:shadow-lg transition min-h-[120px]">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-lg">
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
                  className={machine.fanSpeed !== "off" ? "bg-primary/10" : ""}
                >
                  {machine.fanSpeed.toUpperCase()}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Machine Metrics */}
      <div className="mt-10">
        <h3 className="font-medium text-2xl mb-4">Machine Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <div className="text-lg text-gray-500">Max Glasses</div>
            <div className="text-3xl font-bold">{maxGlasses}</div>
            <div className="text-sm text-gray-400">With current battery</div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <div className="text-lg text-gray-500">Charging Time</div>
            <div className="text-3xl font-bold">
              {machine.isCharging
                ? hoursToFullCharge < 1
                  ? `${Math.round(hoursToFullCharge * 60)}m`
                  : `${hoursToFullCharge.toFixed(1)}h`
                : "Disconnected"}
            </div>
            <div className="text-sm text-gray-400">To full battery</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default Machine;
