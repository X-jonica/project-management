import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaLock,
    FaCheck,
} from "react-icons/fa";

export default function RegisterForm() {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (motDePasse !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        try {
            const newUser = {
                nom: nom,
                email: email,
                mot_de_passe: motDePasse,
                role: "user",
            };

            const response = await axios.post(
                "http://localhost:8080/manageWeb/utilisateurs",
                newUser
            );

            console.log("Utilisateur créé:", response.data);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            console.error("Erreur lors de l'inscription:", err);
            setError(
                err.response?.data?.message || "Erreur lors de l'inscription"
            );
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCheck className="text-green-500 text-4xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Inscription réussie !
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Votre compte a été créé avec succès.
                    </p>
                    <div className="animate-pulse text-blue-500">
                        Redirection en cours...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header avec dégradé */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
                        <button
                            onClick={() => navigate("/login")}
                            className="absolute left-6 top-6 text-white hover:text-blue-200 transition-colors flex items-center"
                        >
                            <FaArrowLeft className="mr-2" />
                            Retour
                        </button>
                        <h1 className="text-2xl font-bold text-white">
                            Créer un compte
                        </h1>
                        <p className="text-blue-100 mt-2">
                            Rejoignez notre communauté
                        </p>
                    </div>

                    <div className="p-6 sm:p-8">
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-5">
                                {/* Nom complet */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400" />
                                    </div>
                                    <input
                                        id="nom"
                                        name="nom"
                                        type="text"
                                        required
                                        value={nom}
                                        onChange={(e) => setNom(e.target.value)}
                                        placeholder="Nom complet"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Adresse email"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                {/* Mot de passe */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input
                                        id="motDePasse"
                                        name="motDePasse"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={motDePasse}
                                        onChange={(e) =>
                                            setMotDePasse(e.target.value)
                                        }
                                        placeholder="Mot de passe"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                {/* Confirmation mot de passe */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        placeholder="Confirmer le mot de passe"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                            >
                                <span>S'inscrire</span>
                                <svg
                                    className="w-5 h-5 ml-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                    />
                                </svg>
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Vous avez déjà un compte?{" "}
                                <button
                                    onClick={() => navigate("/")}
                                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                >
                                    Se connecter
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
