import { useState, useRef, useEffect } from "react";

const CanonicalSlider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  label = "Speed",
  color = "#4CAF50",
}) => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateAngle = (val) => {
    const mapped = ((val - min) / (max - min)) * 270;
    return 225 - mapped;
  };

  const calculateCoordinates = (angle) => {
    const radians = (angle * Math.PI) / 180;
    const radius = 85;
    const x = 100 + radius * Math.cos(radians);
    const y = 100 + radius * Math.sin(radians);
    return { x, y };
  };

  const handleToValue = (clientX, clientY) => {
    if (!sliderRef.current) return value;

    const rect = sliderRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let angle =
      Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);

    if (angle < -45 && angle > -225) {
      angle = -45;
    } else if (angle > -45) {
      angle = -45;
    } else if (angle < -225) {
      angle = -225;
    }

    const mappedValue = ((225 - angle) / 270) * (max - min) + min;
    return Math.max(min, Math.min(max, Math.round(mappedValue)));
  };

  const handleStart = (clientX, clientY) => {
    setIsDragging(true);
    const newValue = handleToValue(clientX, clientY);
    onChange(newValue);
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    const newValue = handleToValue(clientX, clientY);
    onChange(newValue);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  const angle = calculateAngle(value);
  const { x, y } = calculateCoordinates(angle);
  const gradientRotation = 225 - (value / (max - min)) * 270;

  return (
<div className="flex flex-col items-center gap-2">
  <div
    ref={sliderRef}
    className="canonical-slider"
    onMouseDown={handleMouseDown}
    onTouchStart={handleTouchStart}
    style={{
      background: `conic-gradient(from ${gradientRotation}deg, ${color}, #FFC107)`,
    }}
  >
    <div
      className="canonical-slider-handle"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        backgroundColor: color,
      }}
    />
    <div className="canonical-slider-value text-xl font-semibold">{value}%</div>
  </div>
  <div className="text-xl font-semibold mt-2">{label}</div>
</div>

  );
};

export default CanonicalSlider;
