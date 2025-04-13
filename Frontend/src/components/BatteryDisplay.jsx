import { Battery, Fan, Lightbulb, PaymentMachine } from "@/components/Icons";
import { Progress } from "@/components/ui/progress";
import { calculateChargingTime } from "@/lib/calculations.js";

const BatteryDisplay = ({
  batteryPercentage,
  isCharging,
  solarEfficiency,
  isPaymentMachineOn,
  isLightOn,
  fanSpeed,
}) => {
  // Determine color based on battery level
  const getColor = () => {
    if (batteryPercentage > 60) return "bg-green-500";
    if (batteryPercentage > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Calculate estimated charging time
  const hoursToFullCharge = isCharging
    ? calculateChargingTime(batteryPercentage, solarEfficiency)
    : 0;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Battery className="text-sugarcane inline-block" />
          Battery Status
        </h3>
        {isCharging && (
          <div className="text-xs px-2 py-1 bg-solar-light/20 text-solar-dark rounded-full flex items-center animate-pulse-charging">
            <span className="h-2 w-2 bg-solar rounded-full mr-1"></span>
            Charging
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Level</span>
          <span className="font-semibold">{batteryPercentage.toFixed(1)}%</span>
        </div>
        <Progress
          value={batteryPercentage}
          className="h-3"
          indicatorClassName={getColor()}
        />
      </div>

      {isCharging && (
        <div className="text-sm text-gray-600 mb-4">
          <span className="font-medium">Est. time to full charge:</span>{" "}
          {hoursToFullCharge < 1
            ? `${Math.round(hoursToFullCharge * 60)} minutes`
            : `${hoursToFullCharge.toFixed(1)} hours`}
        </div>
      )}

      <div className="border-t pt-2">
        <h4 className="text-sm font-medium mb-2">Connected Appliances</h4>
        <div className="flex items-center justify-around gap-2">
          <div
            className={`text-center p-2 rounded ${
              isPaymentMachineOn
                ? "bg-sugarcane-light/20 text-sugarcane-dark"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <PaymentMachine className="h-5 w-5 mx-auto" />
            <span className="text-xs block mt-1">Payment</span>
          </div>

          <div
            className={`text-center p-2 rounded ${
              isLightOn
                ? "bg-solar-light/20 text-solar-dark"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <Lightbulb className="h-5 w-5 mx-auto" />
            <span className="text-xs block mt-1">Light</span>
          </div>

          <div
            className={`text-center p-2 rounded ${
              fanSpeed !== "off"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <Fan
              className={`h-5 w-5 mx-auto ${
                fanSpeed !== "off" ? "animate-spin-slow" : ""
              }`}
            />
            <span className="text-xs block mt-1">
              {fanSpeed === "off"
                ? "Fan Off"
                : `${fanSpeed.charAt(0).toUpperCase() + fanSpeed.slice(1)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatteryDisplay;
