import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

export default function InReviewBadge() {
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-100 border border-gray-200 cursor-pointer transition-colors duration-300"
        >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500 group-hover:text-amber-500 transition-colors duration-300" />
            <span className="text-[13px] font-medium text-gray-500 group-hover:text-amber-500 transition-colors duration-300">
                In review
            </span>
        </motion.div>
    );
}
