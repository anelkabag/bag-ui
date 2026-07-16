import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, BatteryCharging } from 'lucide-react';

export default function MorphButton() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="relative flex items-center justify-center text-white px-6 py-3 rounded-xl bg-black hover:bg-black border border-gray-200 border border-white/5 cursor-pointer transition-colors duration-150"
        >
            <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
                <AnimatePresence mode="popLayout" initial={false}>
                    {!isHovered ? (
                        <motion.div
                            key="icon1"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 600, damping: 25 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Battery className="w-4 h-4" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="icon2"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 600, damping: 25 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <BatteryCharging className="w-4 h-4" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <span className="font-medium tracking-tight text-[13px] ml-2.5">Power</span>
        </motion.button>
    );
}