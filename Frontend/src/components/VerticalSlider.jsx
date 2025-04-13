import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { useIsMobile } from "../hooks/use-mobile";

const VerticalSlider = ({ value, onChange, min = 0, max = 100, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();

  const handleSliderClick = (e) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const height = rect.height;
    const y = e.clientY - rect.top;

    const percentage = 1 - y / height;
    const newValue = Math.round(min + percentage * (max - min));

    onChange(Math.max(min, Math.min(max, newValue)));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleSliderClick(e);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const slider = document.getElementById("vertical-slider");
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const height = rect.height;
    const y = e.clientY - rect.top;

    const percentage = 1 - y / height;
    const newValue = Math.round(min + percentage * (max - min));

    onChange(Math.max(min, Math.min(max, newValue)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    handleTouchMove(e);

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const slider = document.getElementById("vertical-slider");
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const height = rect.height;
    const y = touch.clientY - rect.top;

    const percentage = 1 - y / height;
    const newValue = Math.round(min + percentage * (max - min));

    onChange(Math.max(min, Math.min(max, newValue)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const fillHeight = ((value - min) / (max - min)) * 100;
  const sliderHeight = isMobile ? "h-36" : "h-48";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="text-sm font-semibold mb-1">High</div>
      <div
        id="vertical-slider"
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className={`relative ${sliderHeight} w-8 bg-gray-200 rounded-full cursor-pointer`}
        onMouseDown={handleMouseDown}
        onClick={handleSliderClick}
        onTouchStart={handleTouchStart}
      >
        {/* Cone Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[180px] border-l-transparent border-r-transparent border-t-gray-300/30"
            style={{
              transform: `scale(${isMobile ? 0.75 : 1})`,
              transformOrigin: "top center",
            }}
          />
        </div>

        {/* Fill */}
        <div
          className="absolute top-0 left-0 right-0 bg-primary rounded-t-full transition-all"
          style={{ height: `${fillHeight}%` }}
        />

        {/* Handle */}
        <div
          className="absolute left-1/2 w-6 h-6 bg-white border-2 border-primary rounded-full -translate-x-1/2 shadow-md transition-all"
          style={{ top: `calc(${100 - fillHeight}% - 12px)` }}
        />
      </div>
      <div className="text-sm font-semibold mt-1">Low</div>
      <div className="mt-2 text-center">
        <div className="text-xl font-bold">{value}%</div>
        <div className="text-xs text-gray-500">Machine Speed</div>
      </div>
    </div>
  );
};

export default VerticalSlider;
