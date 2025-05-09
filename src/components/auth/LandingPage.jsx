import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    FaChalkboardTeacher,
    FaTasks,
    FaUsers,
    FaChartLine,
} from "react-icons/fa";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Hero Section */}
            <div className="container mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="text-5xl font-bold text-indigo-900 mb-6">
                        Edu<span className="text-blue-600">Manage</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
                        La plateforme intuitive pour gérer vos projets
                        pédagogiques en toute simplicité
                    </p>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex justify-center gap-6"
                    >
                        <Link
                            to="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all"
                        >
                            Connexion
                        </Link>
                        <Link
                            to="/register"
                            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg transition-all"
                        >
                            Inscription
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Animated Illustration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mt-20 flex justify-center"
                >
                    <div className="relative w-full max-w-2xl h-64">
                        <motion.div
                            animate={{
                                y: [0, -15, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute left-0 top-0 bg-white p-4 rounded-xl shadow-lg w-32"
                        >
                            <FaChalkboardTeacher className="text-blue-500 text-2xl mb-2" />
                            <h3 className="font-semibold">Enseignants</h3>
                        </motion.div>

                        <motion.div
                            animate={{
                                y: [0, 15, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5,
                            }}
                            className="absolute right-0 top-10 bg-white p-4 rounded-xl shadow-lg w-32"
                        >
                            <FaTasks className="text-indigo-500 text-2xl mb-2" />
                            <h3 className="font-semibold">Projets</h3>
                        </motion.div>

                        <motion.div
                            animate={{
                                y: [0, -20, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1,
                            }}
                            className="absolute left-1/4 bottom-0 bg-white p-4 rounded-xl shadow-lg w-32"
                        >
                            <FaUsers className="text-purple-500 text-2xl mb-2" />
                            <h3 className="font-semibold">Étudiants</h3>
                        </motion.div>

                        <motion.div
                            animate={{
                                y: [0, 10, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1.5,
                            }}
                            className="absolute right-1/4 bottom-5 bg-white p-4 rounded-xl shadow-lg w-32"
                        >
                            <FaChartLine className="text-green-500 text-2xl mb-2" />
                            <h3 className="font-semibold">Suivi</h3>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-white p-6 rounded-xl shadow-md"
                    >
                        <div className="text-blue-500 text-3xl mb-4">📊</div>
                        <h3 className="font-bold text-lg mb-2">
                            Visualisation claire
                        </h3>
                        <p className="text-gray-600">
                            Suivez l'avancement de tous vos projets en un coup
                            d'œil
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-white p-6 rounded-xl shadow-md"
                    >
                        <div className="text-indigo-500 text-3xl mb-4">👥</div>
                        <h3 className="font-bold text-lg mb-2">
                            Collaboration
                        </h3>
                        <p className="text-gray-600">
                            Structurez efficacement vos projets étudiants
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-white p-6 rounded-xl shadow-md"
                    >
                        <div className="text-purple-500 text-3xl mb-4">⏱️</div>
                        <h3 className="font-bold text-lg mb-2">
                            Gain de temps
                        </h3>
                        <p className="text-gray-600">
                            Automatisez les tâches répétitives
                        </p>
                    </motion.div>
                </motion.div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mt-32 text-center"
                >
                    <h2 className="text-3xl font-bold text-indigo-900 mb-6">
                        Prêt à transformer votre gestion pédagogique ?
                    </h2>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-block"
                    >
                        <Link
                            to="/register"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all"
                        >
                            Commencer maintenant - C'est gratuit !
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
