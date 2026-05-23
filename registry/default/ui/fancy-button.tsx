"use client";

import { motion } from "framer-motion";

export function FancyButton() {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white px-6 py-3 rounded-xl"
        >
            Fancy Button
        </motion.button>
    );
}