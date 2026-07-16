import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

export default function ColorMorphButton() {
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
                <Star className={`w-4 h-4 transition-colors duration-300 ${isHovered ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300'}`} />
            </div>
            <span className="font-medium tracking-tight text-[13px] ml-2.5">Favorite</span>
        </motion.button>
    );
}