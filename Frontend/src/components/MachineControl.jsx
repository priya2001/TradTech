import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fan, Lightbulb, PaymentMachine } from "./Icons";

const MachineControl = ({ machine, updateMachine, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-6 rounded-2xl shadow-[0_4px_20px_rgba(34,197,94,0.25)] border border-green-100 transition-all duration-300">
      <CardHeader className="pb-2 border-b border-green-100">
        <CardTitle className="flex justify-between items-center text-xl text-black-700">
          <span>Machine Control</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="border-green-300 text-green-600 hover:bg-green-50"
            >
              {isExpanded ? "Minimize" : "Expand"}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onViewDetails}
              className="bg-green-600 hover:bg-green-700"
            >
              Details
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isExpanded ? (
          <div className="flex flex-col gap-4 pt-4">
            <div className="grid grid-cols-3 gap-3">
              {/* Charging */}
              <Button
                variant={machine.isCharging ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  updateMachine(machine.id, { isCharging: !machine.isCharging })
                }
                className={`flex flex-col items-center py-3 h-auto ${
                  machine.isCharging
                    ? "bg-green-600 text-white"
                    : "border-green-300 text-green-600 hover:bg-green-50"
                }`}
              >
                ⚡
                <span className="mt-1 text-xs">
                  {machine.isCharging ? "Stop Charging" : "Start Charging"}
                </span>
              </Button>

              {/* Payment */}
              <Button
                variant={machine.isPaymentMachineOn ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  updateMachine(machine.id, {
                    isPaymentMachineOn: !machine.isPaymentMachineOn,
                  })
                }
                className={`flex flex-col items-center py-3 h-auto ${
                  machine.isPaymentMachineOn
                    ? "bg-green-600 text-white"
                    : "border-green-300 text-green-600 hover:bg-green-50"
                }`}
              >
                <PaymentMachine className="h-5 w-5" />
                <span className="mt-1 text-xs">
                  {machine.isPaymentMachineOn ? "Payment: ON" : "Payment: OFF"}
                </span>
              </Button>

              {/* Light */}
              <Button
                variant={machine.isLightOn ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  updateMachine(machine.id, { isLightOn: !machine.isLightOn })
                }
                className={`flex flex-col items-center py-3 h-auto ${
                  machine.isLightOn
                    ? "bg-green-600 text-white"
                    : "border-green-300 text-green-600 hover:bg-green-50"
                }`}
              >
                <Lightbulb className="h-5 w-5" />
                <span className="mt-1 text-xs">
                  {machine.isLightOn ? "Light: ON" : "Light: OFF"}
                </span>
              </Button>
            </div>

            {/* Fan Speed */}
            <Button
              variant={machine.fanSpeed !== "off" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const speeds = ["off", "low", "medium", "high"];
                const currentIndex = speeds.indexOf(machine.fanSpeed);
                const nextIndex = (currentIndex + 1) % speeds.length;
                updateMachine(machine.id, { fanSpeed: speeds[nextIndex] });
              }}
              className={`flex items-center justify-center py-2 w-full ${
                machine.fanSpeed !== "off"
                  ? "bg-green-600 text-white"
                  : "border-green-300 text-green-600 hover:bg-green-50"
              }`}
            >
              <Fan
                className={`h-5 w-5 mr-2 ${
                  machine.fanSpeed !== "off" ? "animate-spin-slow" : ""
                }`}
              />
              <span>Fan: {machine.fanSpeed.toUpperCase()}</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                {machine.speed}%
              </div>
              <span className="font-medium text-green-700">Speed</span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-1 ${
                  machine.isCharging ? "text-green-600" : "text-gray-400"
                }`}
              >
                ⚡
                <span className="text-sm">
                  {machine.isCharging ? "Charging" : "Off"}
                </span>
              </div>

              <PaymentMachine
                className={`h-4 w-4 ${
                  machine.isPaymentMachineOn
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              <Lightbulb
                className={`h-4 w-4 ${
                  machine.isLightOn ? "text-green-600" : "text-gray-400"
                }`}
              />
              <Fan
                className={`h-4 w-4 ${
                  machine.fanSpeed !== "off"
                    ? "text-green-600 animate-spin-slow"
                    : "text-gray-400"
                }`}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MachineControl;
