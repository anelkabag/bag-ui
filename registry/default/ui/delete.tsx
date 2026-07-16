import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function ShakeButton() {
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
                <motion.div
                    animate={{
                        y: isHovered ? [0, -2, 0, -2, 0] : 0,
                        rotate: isHovered ? [0, -10, 10, -10, 0] : 0
                    }}
                    transition={{ duration: 0.4 }}
                >
                    <Trash2 className="w-4 h-4 text-red-400" />
                </motion.div>
            </div>
            <span className="font-medium tracking-tight text-[13px] ml-2.5 text-white">Delete Bag\Ui</span>
        </motion.button>
    );
}