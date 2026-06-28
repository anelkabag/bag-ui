import {motion, Variants} from 'framer-motion';

export default function CTASection() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants =  {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    return (
        <section className="w-full px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={containerVariants}
                className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-3xl bg-black"
            >
                {/* Gradient accent - left side */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-emerald-600/30 via-emerald-500/20 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-emerald-600/20 to-transparent rounded-full blur-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 px-6 py-24 sm:px-12 sm:py-28 lg:px-20 flex flex-col items-center text-center">
                    {/* Heading */}
                    <motion.h2
                        variants={itemVariants}
                        className="text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight mb-6"
                    >
                        Ready for more demand?
                    </motion.h2>

                    {/* Subheading */}
                    <motion.p
                        variants={itemVariants}
                        className="text-xl sm:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed"
                    >
                        Stop losing leads to 'Get in touch' buttons and boring contact forms.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6 w-full sm:w-auto"
                    >
                        {/* Primary CTA */}
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 255, 255, 0.2)' }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-3.5 bg-white text-black font-semibold rounded-lg transition-all duration-200 hover:shadow-2xl cursor-pointer"
                        >
                            Start free trial
                        </motion.button>

                        {/* Secondary CTA */}
                        <motion.button
                            whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.5)' }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-3.5 border border-gray-700 text-white font-semibold rounded-lg transition-all duration-200 hover:border-gray-500 hover:bg-white/5 cursor-pointer"
                        >
                            Book a demo
                        </motion.button>
                    </motion.div>

                    {/* Supporting text */}
                    <motion.p
                        variants={itemVariants}
                        className="text-sm text-gray-500"
                    >
                        14 Days Free. No credit card required.
                    </motion.p>
                </div>
            </motion.div>
        </section>
    );
}