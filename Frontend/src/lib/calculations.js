// Constants for calculations
const JUICE_YIELD_PER_SUGARCANE = 250; // ml of juice per sugarcane
const GLASS_SIZE = 200; // ml
const BATTERY_USAGE_PER_GLASS = 0.5; // % battery used per glass
const BATTERY_CHARGING_RATE = 5; // % per hour with optimal sunlight
const BATTERY_USAGE_PAYMENT_MACHINE = 0.1; // % per hour
const BATTERY_USAGE_LIGHT = 0.2; // % per hour
const BATTERY_USAGE_FAN = {
  low: 0.3, // % per hour
  medium: 0.5, // % per hour
  high: 0.8, // % per hour
};

// Calculate the number of sugarcanes needed for a given number of glasses
function calculateSugarcanesNeeded(glassCount) {
  const totalJuiceNeeded = glassCount * GLASS_SIZE;
  return Math.ceil(totalJuiceNeeded / JUICE_YIELD_PER_SUGARCANE);
}

// Calculate the maximum glasses that can be produced with current battery
function calculateMaxGlassesWithBattery(batteryPercentage) {
  return Math.floor(batteryPercentage / BATTERY_USAGE_PER_GLASS);
}

// Check if there's enough battery to fulfill an order
function hasEnoughBattery(glassCount, batteryPercentage) {
  const batteryNeeded = glassCount * BATTERY_USAGE_PER_GLASS;
  return batteryNeeded <= batteryPercentage;
}

// Calculate the battery usage for additional appliances
function calculateAppliancesBatteryUsage(
  paymentMachineHours,
  lightHours,
  fanHours,
  fanSpeed
) {
  const paymentMachineUsage =
    paymentMachineHours * BATTERY_USAGE_PAYMENT_MACHINE;
  const lightUsage = lightHours * BATTERY_USAGE_LIGHT;
  const fanUsage = fanHours * BATTERY_USAGE_FAN[fanSpeed];

  return paymentMachineUsage + lightUsage + fanUsage;
}

// Calculate estimated time to fully charge the battery
function calculateChargingTime(currentBatteryPercentage, solarEfficiency) {
  const remainingPercentage = 100 - currentBatteryPercentage;
  const adjustedChargingRate = BATTERY_CHARGING_RATE * solarEfficiency;

  return remainingPercentage / adjustedChargingRate;
}

// Calculate battery usage for juice production
function calculateJuiceBatteryUsage(glassCount) {
  return glassCount * BATTERY_USAGE_PER_GLASS;
}

// Calculate battery drain over time with appliances running
function calculateBatteryDrainRate(isPaymentMachineOn, isLightOn, fanSpeed) {
  let hourlyDrain = 0;

  if (isPaymentMachineOn) hourlyDrain += BATTERY_USAGE_PAYMENT_MACHINE;
  if (isLightOn) hourlyDrain += BATTERY_USAGE_LIGHT;
  if (fanSpeed !== "off") hourlyDrain += BATTERY_USAGE_FAN[fanSpeed];

  return hourlyDrain;
}

// Calculate machine production efficiency based on battery level
function calculateEfficiency(batteryPercentage) {
  if (batteryPercentage < 20) {
    return 0.7 + (batteryPercentage / 100) * 0.3;
  }
  return 1;
}

// Mock function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

// Export functions
export {
  calculateSugarcanesNeeded,
  calculateMaxGlassesWithBattery,
  hasEnoughBattery,
  calculateAppliancesBatteryUsage,
  calculateChargingTime,
  calculateJuiceBatteryUsage,
  calculateBatteryDrainRate,
  calculateEfficiency,
  calculateDistance,
};
