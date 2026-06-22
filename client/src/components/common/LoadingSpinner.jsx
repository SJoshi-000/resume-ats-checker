import { motion } from "framer-motion";

const dotVariants = {
  animate: (i) => ({
    y: [0, -12, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 0.8,
      delay: i * 0.15,
      ease: "easeInOut",
    },
  }),
};

/**
 * Premium loading animation with bouncing dots and pulsing message.
 */
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* Bouncing dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            custom={i}
            animate="animate"
            variants={dotVariants}
            className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400"
          />
        ))}
      </div>

      {/* Message */}
      <motion.p
        className="text-gray-400 text-base font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        Analyzing your resume…
      </motion.p>

      {/* Scanning bar */}
      <div className="w-64 h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "50%" }}
        />
      </div>
    </div>
  );
}
