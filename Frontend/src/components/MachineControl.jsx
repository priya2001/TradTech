import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fan, Lightbulb, PaymentMachine } from "./Icons";

const MachineControl = ({ machine, updateMachine, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-6 rounded-2xl shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Machine Control</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Minimize" : "Expand"}
            </Button>
            <Button variant="default" size="sm" onClick={onViewDetails}>
              Details
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isExpanded ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={machine.isCharging ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  updateMachine(machine.id, { isCharging: !machine.isCharging })
                }
                className="flex flex-col items-center py-3 h-auto"
              >
                <span
                  className={`h-5 w-5 ${
                    machine.isCharging
                      ? "text-primary-foreground"
                      : "text-primary"
                  }`}
                >
                  ⚡
                </span>
                <span className="mt-1 text-xs">
                  {machine.isCharging ? "Stop Charging" : "Start Charging"}
                </span>
              </Button>

              <Button
                variant={machine.isPaymentMachineOn ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  updateMachine(machine.id, {
                    isPaymentMachineOn: !machine.isPaymentMachineOn,
                  })
                }
                className="flex flex-col items-center py-3 h-auto"
              >
                <PaymentMachine
                  className={`h-5 w-5 ${
                    machine.isPaymentMachineOn
                      ? "text-primary-foreground"
                      : "text-primary"
                  }`}
                />
                <span className="mt-1 text-xs">
                  {machine.isPaymentMachineOn ? "Payment: ON" : "Payment: OFF"}
                </span>
              </Button>

              <Button
                variant={machine.isLightOn ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  updateMachine(machine.id, { isLightOn: !machine.isLightOn })
                }
                className="flex flex-col items-center py-3 h-auto"
              >
                <Lightbulb
                  className={`h-5 w-5 ${
                    machine.isLightOn
                      ? "text-primary-foreground"
                      : "text-primary"
                  }`}
                />
                <span className="mt-1 text-xs">
                  {machine.isLightOn ? "Light: ON" : "Light: OFF"}
                </span>
              </Button>
            </div>

            <Button
              variant={machine.fanSpeed !== "off" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const speeds = ["off", "low", "medium", "high"];
                const currentIndex = speeds.indexOf(machine.fanSpeed);
                const nextIndex = (currentIndex + 1) % speeds.length;
                updateMachine(machine.id, { fanSpeed: speeds[nextIndex] });
              }}
              className="flex items-center justify-center py-2 w-full"
            >
              <Fan
                className={`h-5 w-5 mr-2 ${
                  machine.fanSpeed !== "off"
                    ? "text-primary-foreground animate-spin-slow"
                    : "text-primary"
                }`}
              />
              <span>Fan: {machine.fanSpeed.toUpperCase()}</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {machine.speed}%
              </div>
              <span className="font-medium">Speed</span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-1 ${
                  machine.isCharging ? "text-green-600" : "text-gray-400"
                }`}
              >
                <span className="h-4 w-4">⚡</span>
                <span className="text-sm">
                  {machine.isCharging ? "Charging" : "Off"}
                </span>
              </div>

              <div
                className={`flex items-center gap-1 ${
                  machine.isPaymentMachineOn
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <PaymentMachine className="h-4 w-4" />
              </div>

              <div
                className={`flex items-center gap-1 ${
                  machine.isLightOn ? "text-green-600" : "text-gray-400"
                }`}
              >
                <Lightbulb className="h-4 w-4" />
              </div>

              <div
                className={`flex items-center gap-1 ${
                  machine.fanSpeed !== "off"
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <Fan
                  className={`h-4 w-4 ${
                    machine.fanSpeed !== "off" ? "animate-spin-slow" : ""
                  }`}
                />
                <span className="text-xs">
                  {machine.fanSpeed !== "off" ? machine.fanSpeed : ""}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MachineControl;
