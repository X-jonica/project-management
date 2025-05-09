import { useState, useEffect } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProjectCards() {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [hasProjects, setHasProjects] = useState(false);
    const [sortOrder, setSortOrder] = useState("az");
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");
    const authToken = localStorage.getItem("authToken");

    // Normalise les statuts pour une comparaison cohérente
    const normalizeStatus = (status) => {
        if (!status) return "";
        return status.toLowerCase().replace("é", "e");
    };

    const sortProjectsByDate = (projectsList) => {
        return [...projectsList].sort((a, b) => {
            const dateA = new Date(a.dateCreation?.replace("[UTC]", "") || 0);
            const dateB = new Date(b.dateCreation?.replace("[UTC]", "") || 0);
            return dateB - dateA;
        });
    };

    useEffect(() => {
        if (!userId) {
            navigate("/");
            return;
        }

        const fetchProjects = async () => {
            try {
                let url = `http://localhost:8080/manageWeb/projets/user/${userId}`;

                const config = {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                };

                // Utilisation des valeurs normalisées pour les URLs
                const normalizedStatus = normalizeStatus(statusFilter);
                if (normalizedStatus === "en_cours") {
                    url = `http://localhost:8080/manageWeb/projets/user/${userId}/en_cours`;
                } else if (normalizedStatus === "termine") {
                    url = `http://localhost:8080/manageWeb/projets/user/${userId}/termines`;
                } else if (normalizedStatus === "en_attente") {
                    url = `http://localhost:8080/manageWeb/projets/user/${userId}/en_attente`;
                }

                const response = await axios.get(url, config);
                const sortedProjects = sortProjectsByDate(response.data);
                setProjects(sortedProjects);
                setFilteredProjects(sortedProjects);
                setHasProjects(response.data.length > 0);
                setError(null);
            } catch (err) {
                if (
                    err.response?.status === 404 &&
                    err.response?.data?.message?.includes("aucun projet")
                ) {
                    setProjects([]);
                    setFilteredProjects([]);
                    setHasProjects(false);
                } else {
                    setError(
                        err.response?.data?.message ||
                            err.message ||
                            "Erreur de chargement"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [statusFilter, userId, authToken, navigate]);

    useEffect(() => {
        const results = projects.filter((project) => {
            const matchesSearch =
                project.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                project.titre?.toLowerCase().includes(searchTerm.toLowerCase());

            // Si aucun filtre de statut n'est sélectionné ou si le statut correspond
            const matchesStatus =
                statusFilter === "all" ||
                normalizeStatus(project.statut) ===
                    normalizeStatus(statusFilter);

            return matchesSearch && matchesStatus;
        });

        setFilteredProjects(sortProjectsByDate(results));
    }, [searchTerm, projects, statusFilter]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const cleanedDate = dateString.replace("[UTC]", "");
        return moment(cleanedDate).format("DD/MM/YYYY");
    };

    const onDelete = async (id) => {
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible."
            )
        ) {
            try {
                await axios.delete(
                    `http://localhost:8080/manageWeb/projets/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                const response = await axios.get(
                    `http://localhost:8080/manageWeb/projets/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                const sortedProjects = sortProjectsByDate(response.data);
                setProjects(sortedProjects);
                setFilteredProjects(sortedProjects);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        "Erreur lors de la suppression"
                );
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-5 w-5 text-red-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">
                            Erreur lors du chargement des projets: {error}
                        </p>
                        <p className="mt-1 text-gray-500 mt-4">
                            Commencez par créer votre premier projet
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Rechercher un projet..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tous mes projets</option>
                        <option value="EN_COURS">En cours</option>
                        <option value="TERMINE">Terminés</option>
                        <option value="EN_ATTENTE">En attente</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProjects.map((project) => {
                    const normalizedStatus = normalizeStatus(project.statut);
                    return (
                        <div
                            key={project.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                                        {project.nom ||
                                            project.titre ||
                                            "Projet sans nom"}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            normalizedStatus === "termine"
                                                ? "bg-green-100 text-green-800"
                                                : normalizedStatus ===
                                                  "en_cours"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {normalizedStatus === "termine"
                                            ? "Terminé"
                                            : normalizedStatus === "en_cours"
                                            ? "En cours"
                                            : "En attente"}
                                    </span>
                                </div>

                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-2 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>
                                            Créé:{" "}
                                            {formatDate(project.dateCreation)}
                                        </span>
                                    </div>

                                    {project.dateLivraison && (
                                        <div className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-2 text-gray-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span>
                                                Livraison:{" "}
                                                {formatDate(
                                                    project.dateLivraison
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex justify-between space-x-2">
                                    <button
                                        onClick={() =>
                                            navigate(`/projects/${project.id}`)
                                        }
                                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Voir détails
                                    </button>
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/projects/${project.id}/edit`
                                            )
                                        }
                                        className="text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
                                        title="Modifier"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => onDelete(project.id)}
                                        className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-100 transition-colors"
                                        title="Supprimer"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!hasProjects && !loading && !error && (
                <div className="text-center py-8">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                        {searchTerm
                            ? "Aucun projet correspondant"
                            : "Vous n'avez aucun projet"}
                    </h3>
                </div>
            )}
        </div>
    );
}
