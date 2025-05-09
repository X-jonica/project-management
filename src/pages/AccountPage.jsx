import { useState, useEffect } from "react";
import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";

export default function AccountPage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        nom: "",
        email: "",
        role: "",
        mot_de_passe: "",
    });
    const navigate = useNavigate();

    // Récupération de l'ID utilisateur et du token
    const userId = localStorage.getItem("userId");
    const authToken = localStorage.getItem("userData");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:8080/manageWeb/utilisateurs/update/${userId}`,
                {
                    nom: formData.nom,
                    email: formData.email,
                    mot_de_passe: formData.mot_de_passe,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Mise à jour optimiste des données
            const updatedUser = { ...userData, ...formData };
            setUserData(updatedUser);
            localStorage.setItem("userData", JSON.stringify(updatedUser));
            setEditMode(false);
            setFormData({ ...formData, mot_de_passe: "" });

            alert("Informations mises à jour avec succès");
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            alert(
                error.response?.data?.message || "Erreur lors de la mise à jour"
            );
        }
    };

    const handleDeconnexion = () => {
        if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
            // Vider toutes les données d'authentification
            localStorage.clear();
            sessionStorage.clear();

            // Effacer également les cookies liés à l'authentification
            document.cookie.split(";").forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(
                        /=.*/,
                        `=;expires=${new Date().toUTCString()};path=/`
                    );
            });

            // Redirection vers la page de login
            navigate("/");
        }
    };

    useEffect(() => {
        if (!userId || !authToken) {
            alert("sesion securisé ! vouz devez vous connecter !");
            navigate("/dashboard");
            return;
        }

        const fetchUserData = async () => {
            const isOnline = window.navigator.onLine;

            if (!isOnline) {
                console.warn("Mode hors ligne activé");

                const storedData = localStorage.getItem("userData");
                if (storedData) {
                    try {
                        const parsedData = JSON.parse(storedData);
                        if (parsedData.nom && parsedData.email) {
                            setUserData(parsedData);
                            setFormData(parsedData);
                            setError("Vous êtes en mode hors ligne");
                            setLoading(false); // Ajouté ici
                            return;
                        }
                    } catch (e) {
                        console.error("Erreur parsing localStorage:", e);
                    }
                }

                setError("Données indisponibles en mode hors ligne");
                setLoading(false); // Ajouté ici
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8080/manageWeb/utilisateurs/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                const { nom, email, role, dateCreation } = response.data;
                const userData = {
                    nom,
                    email,
                    role: role || "user",
                    dateCreation,
                };

                setUserData(userData);
                setFormData(userData);
                localStorage.setItem("userData", JSON.stringify(userData));
                setError(null);
            } catch (error) {
                console.error("Erreur API:", error);
                setError("Erreur réseau");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, authToken, navigate]);

    if (loading) {
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 ml-64">
                    <Header />
                    <main className="p-6 mt-16">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex">
                <Sidebar />
                <div className="flex-1 ml-64">
                    <Header />
                    <main className="p-6 mt-16">
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        {error ||
                                            "Impossible de charger les données utilisateur"}
                                    </p>
                                    <div className="mt-3 space-x-3">
                                        <button
                                            onClick={() =>
                                                window.location.reload()
                                            }
                                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md"
                                        >
                                            Réessayer
                                        </button>
                                        <button
                                            onClick={() =>
                                                navigate("/dashboard")
                                            }
                                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md"
                                        >
                                            Retour au tableau de bord
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Header />
                <main className="p-6 mt-16">
                    {error && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Mon compte
                        </h2>
                        {!editMode && (
                            <button
                                onClick={() => setEditMode(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Modifier mes informations
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 max-w-3xl">
                        <div className="p-8">
                            <div className="flex items-center mb-8">
                                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mr-6">
                                    {userData.nom?.charAt(0)?.toUpperCase() || (
                                        <FaUserCircle />
                                    )}
                                </div>
                                <div>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="nom"
                                            value={formData.nom}
                                            onChange={handleInputChange}
                                            className="text-xl font-semibold mb-1 px-3 py-2 border border-gray-300 rounded-md w-full"
                                        />
                                    ) : (
                                        <h3 className="text-xl font-semibold">
                                            {userData.nom}
                                        </h3>
                                    )}
                                    <p className="text-gray-600">
                                        {userData.email}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">
                                        Informations personnelles
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                Nom complet
                                            </label>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    name="nom"
                                                    value={formData.nom}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            ) : (
                                                <p className="text-gray-800">
                                                    {userData.nom}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                Email
                                            </label>
                                            {editMode ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            ) : (
                                                <p className="text-gray-800">
                                                    {userData.email}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                Rôle
                                            </label>
                                            <p className="text-gray-800 capitalize">
                                                {userData.role}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                Membre depuis
                                            </label>
                                            <p className="text-gray-800">
                                                {new Date(
                                                    userData.dateCreation ||
                                                        new Date()
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">
                                        Sécurité
                                    </h4>
                                    <div className="space-y-4">
                                        {editMode ? (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                                    Nouveau mot de passe
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={
                                                            showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        name="mot_de_passe"
                                                        value={
                                                            formData.mot_de_passe
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                                                        placeholder="Laissez vide pour ne pas changer"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword
                                                            )
                                                        }
                                                    >
                                                        {showPassword ? (
                                                            <FaEyeSlash />
                                                        ) : (
                                                            <FaEye />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : null}
                                        <button
                                            onClick={handleDeconnexion}
                                            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium py-2 px-4 rounded-lg transition-colors border border-gray-200"
                                        >
                                            Se déconnecter
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {editMode && (
                                <div className="mt-8 flex justify-end space-x-3">
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setFormData({
                                                nom: userData.nom,
                                                email: userData.email,
                                                role: userData.role,
                                                mot_de_passe:
                                                    userData.mot_de_passe,
                                            });
                                            setShowPassword(false);
                                        }}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
