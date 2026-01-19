import React, { useEffect, useRef, useState } from "react";

export default function AnimatedScore({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);
  const [anim, setAnim] = useState("");

  useEffect(() => {
    if (value !== prevValue.current) {
      setAnim(value > prevValue.current ? "up" : "down");
      setTimeout(() => setAnim(""), 400);
      setDisplay(value);
      prevValue.current = value;
    }
  }, [value]);

  return (
    <span
      className={`transition-all duration-300 text-4xl font-extrabold mb-2 inline-block ${
        anim === "up"
          ? "text-green-400 scale-110 animate-bounce"
          : anim === "down"
          ? "text-red-400 scale-90 animate-pulse"
          : "text-white dark:text-gray-100"
      }`}
    >
      {display}
    </span>
  );
}
