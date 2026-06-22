import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Animated circular SVG score ring with enhanced percentage animation.
 * Color changes by tier: red (<50), amber (50-75), green (>75).
 * Includes sparkle particles at the endpoint for excellent scores.
 */
export default function AnimatedScore({ score = 0, size = 180, strokeWidth = 10 }) {
  const [displayScore, setDisplayScore] = useState(0);
  const [animComplete, setAnimComplete] = useState(false);
  const animRef = useRef(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  // Determine color tier
  const getColor = (s) => {
    if (s >= 75) return { stroke: "#10b981", glow: "rgba(16, 185, 129, 0.3)", label: "Excellent" };
    if (s >= 50) return { stroke: "#f59e0b", glow: "rgba(245, 158, 11, 0.3)", label: "Good" };
    return { stroke: "#f43f5e", glow: "rgba(244, 63, 94, 0.3)", label: "Needs Work" };
  };

  const colorInfo = getColor(score);

  // Animate the counter
  useEffect(() => {
    setAnimComplete(false);
    const duration = 1400;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * score);
      setDisplayScore(current);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setAnimComplete(true);
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [score]);

  // Calculate the position of the ring endpoint for sparkle placement
  const angle = (displayScore / 100) * 360 - 90; // -90 because SVG starts at top
  const angleRad = (angle * Math.PI) / 180;
  const endpointX = size / 2 + radius * Math.cos(angleRad);
  const endpointY = size / 2 + radius * Math.sin(angleRad);

  return (
    <div className="relative flex flex-col items-center gap-4" aria-label={`ATS score: ${score} out of 100, ${colorInfo.label}`} role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow behind the ring */}
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl transition-colors duration-700"
          animate={{ opacity: animComplete ? 0.6 : 0.3 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: colorInfo.glow }}
        />

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 relative z-10"
          aria-hidden="true"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Animated progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colorInfo.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>

        {/* Center score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="flex items-baseline gap-0.5">
            <motion.span
              className="text-5xl font-display font-extrabold tabular-nums"
              style={{ color: colorInfo.stroke }}
              animate={animComplete ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {displayScore}
            </motion.span>
            <AnimatePresence>
              {animComplete && (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-xl font-display font-bold"
                  style={{ color: colorInfo.stroke }}
                >
                  %
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="text-sm text-gray-500 font-medium -mt-1">
            / 100
          </span>
        </div>

        {/* Sparkle particles at ring endpoint for excellent scores */}
        <AnimatePresence>
          {animComplete && score >= 75 && (
            <>
              {[...Array(6)].map((_, i) => {
                const particleAngle = (i / 6) * Math.PI * 2;
                const spread = 16 + Math.random() * 8;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full z-30"
                    style={{
                      left: endpointX - 3,
                      top: endpointY - 3,
                      backgroundColor: colorInfo.stroke,
                    }}
                    initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 0,
                      x: Math.cos(particleAngle) * spread,
                      y: Math.sin(particleAngle) * spread,
                    }}
                    transition={{ duration: 0.6, delay: 0.05 * i, ease: "easeOut" }}
                  />
                );
              })}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Score label */}
      <motion.span
        className="text-sm font-semibold tracking-wide uppercase"
        style={{ color: colorInfo.stroke }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        {colorInfo.label}
      </motion.span>
    </div>
  );
}
