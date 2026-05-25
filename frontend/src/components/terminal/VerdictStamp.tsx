"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VerdictStampProps {
  verdict: string;
}

export function VerdictStamp({ verdict }: VerdictStampProps) {
  const isApproved = verdict.includes("APPROVED");
  const isRejected = verdict.includes("REJECTED");

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
          isApproved && "border-green-500 text-green-500",
          isRejected && "border-red-500 text-red-500",
          !isApproved && !isRejected && "border-yellow-500 text-yellow-500"
        )}
      >
        {verdict}
      </motion.div>
    </div>
  );
}
