import { motion } from "framer-motion";

/**
 * Reusable glassmorphism card wrapper with Framer Motion entrance animation.
 * @param {boolean} elevated — Use the elevated glass variant with stronger blur/glow.
 */
export default function GlassCard({ children, className = "", elevated = false, ...props }) {
  const baseClass = elevated
    ? "glass-elevated rounded-2xl p-6 sm:p-8 transition-all duration-300"
    : "glass rounded-2xl p-6 sm:p-8 transition-all duration-300 glass-hover";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`${baseClass} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
