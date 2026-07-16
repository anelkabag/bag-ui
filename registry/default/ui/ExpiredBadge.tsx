import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function ExpiredBadge() {
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-100 border border-gray-200 cursor-pointer transition-colors duration-300"
        >
            <Clock className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-600 transition-colors duration-300" />
            <span className="text-[13px] text-black group-hover:text-gray-600 transition-colors duration-300">
                Expired
            </span>
        </motion.div>
    );
}
