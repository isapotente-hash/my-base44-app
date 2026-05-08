import React from "react";
import { motion } from "framer-motion";

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="relative w-20 h-20">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-primary/40"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
          />
        ))}
        <motion.div
          className="absolute inset-3 rounded-full bg-primary/20 backdrop-blur-sm"
          animate={{ scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-6 rounded-full bg-primary/40"
          animate={{ scale: [1, 0.85, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="text-center space-y-1">
        <p className="text-foreground font-semibold text-sm">Creating your image...</p>
        <p className="text-muted-foreground text-xs">This usually takes about 10 seconds</p>
      </div>
    </div>
  );
}