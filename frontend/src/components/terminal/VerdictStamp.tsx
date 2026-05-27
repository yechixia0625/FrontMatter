"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VerdictStampProps {
  verdict: string;
}

export function VerdictStamp({ verdict }: VerdictStampProps) {
  const isProceed = verdict.includes("PROCEED TO DUE DILIGENCE");
  const isCritical =
    verdict.includes("VERIFY CRITICAL") || verdict.includes("ECONOMICALLY WEAK");

  return (
    <div className="flex items-center justify-center py-2">
      <motion.div
        initial={{ scale: 3, rotate: -15, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.5,
        }}
        className={cn(
          "px-6 py-2 border-2 rounded font-mono text-sm font-bold uppercase tracking-widest",
          isProceed && "border-green-500 text-green-500",
          isCritical && "border-red-500 text-red-500",
          !isProceed && !isCritical && "border-yellow-500 text-yellow-500"
        )}
      >
        {verdict}
      </motion.div>
    </div>
  );
}
