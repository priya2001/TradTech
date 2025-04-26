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
    <div className="p-6 bg-white rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-dark">
          <Battery className="text-primary inline-block" />
          Battery Status
        </h3>
        {isCharging && (
          <div className="text-xs px-3 py-1 bg-solar-light/20 text-solar-dark rounded-full flex items-center animate-pulse-charging">
            <span className="h-2 w-2 bg-solar rounded-full mr-1"></span>
            Charging
          </div>
        )}
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-sm mb-2">
          <span>Level</span>
          <span className="font-semibold text-dark">{batteryPercentage.toFixed(1)}%</span>
        </div>
        <Progress
          value={batteryPercentage}
          className="h-3 rounded-full"
          indicatorClassName={getColor()}
        />
      </div>

      {isCharging && (
        <div className="text-sm text-gray-600 mb-5">
          <span className="font-medium">Est. time to full charge:</span>{" "}
          {hoursToFullCharge < 1
            ? `${Math.round(hoursToFullCharge * 60)} minutes`
            : `${hoursToFullCharge.toFixed(1)} hours`}
        </div>
      )}

      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-3 text-dark">Connected Appliances</h4>
        <div className="flex items-center justify-around gap-3">
          <div
            className={`text-center p-3 rounded-xl ${
              isPaymentMachineOn
                ? "bg-sugarcane-light/20 text-sugarcane-dark"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <PaymentMachine className="h-6 w-6 mx-auto" />
            <span className="text-xs block mt-1">Payment</span>
          </div>

          <div
            className={`text-center p-3 rounded-xl ${
              isLightOn
                ? "bg-solar-light/20 text-solar-dark"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <Lightbulb className="h-6 w-6 mx-auto" />
            <span className="text-xs block mt-1">Light</span>
          </div>

          <div
            className={`text-center p-3 rounded-xl ${
              fanSpeed !== "off"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <Fan
              className={`h-6 w-6 mx-auto ${
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
