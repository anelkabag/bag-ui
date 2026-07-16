import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

export default function SearchButton() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="relative flex items-center justify-center text-white px-6 py-3 rounded-xl bg-black hover:bg-black border border-white/5 cursor-pointer transition-colors duration-150"
        >
            <span className="font-medium tracking-tight text-[13px] text-white">
                Search
            </span>

            <AnimatePresence initial={false}>
                {isHovered && (
                    <motion.div
                        key="search-icon"
                        initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                        animate={{ width: 16, opacity: 1, marginLeft: 10 }}
                        exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                        transition={{ type: "spring", stiffness: 220, damping: 26 }}
                        className="relative w-4 h-4 flex items-center justify-center shrink-0 overflow-hidden"
                    >
                        <motion.div
                            initial={{ y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 12, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 22 }}
                            className="flex items-center justify-center"
                        >
                            <Search className="w-4 h-4 text-white/80" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}