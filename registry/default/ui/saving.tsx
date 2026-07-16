import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function SavingButton() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="relative flex items-center justify-center text-white px-6 py-3 rounded-xl bg-black hover:bg-black border border-white/5 cursor-pointer transition-colors duration-150"
        >
            <span className="font-medium tracking-tight text-[13px]">Saving</span>

            <AnimatePresence initial={false}>
                {isHovered && (
                    <motion.div
                        key="spinner"
                        initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                        animate={{ width: 16, opacity: 1, marginLeft: 10 }}
                        exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="relative w-4 h-4 flex items-center justify-center shrink-0 overflow-hidden"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            className="flex items-center justify-center"
                        >
                            <Loader2 className="w-4 h-4 text-white/70" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}