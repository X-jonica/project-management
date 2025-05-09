import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaGhost } from "react-icons/fa";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Animation du fantôme */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
          className="mb-8"
        >
          <FaGhost className="text-8xl text-indigo-400 mx-auto" />
        </motion.div>

        <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          Oups ! Page disparue
        </h2>
        <p className="text-lg text-gray-600 max-w-md mb-8">
          La page que vous cherchez s'est envolée ou n'existe plus. Peut-être
          qu'un fantôme l'a emportée...
        </p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300"
          >
            <FaHome />
            Retour à l'accueil
          </Link>
        </motion.div>

        {/* Petits éléments décoratifs */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-purple-200 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-16 w-24 h-24 bg-indigo-200 rounded-full opacity-20"></div>
      </motion.div>
    </div>
  );
}
