import { useState, useEffect } from "react";
import Header from "../components/dashboard/Header";
import ProjectProgress from "../components/dashboard/ProjectProgress";
import Sidebar from "../components/dashboard/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import {
  FaProjectDiagram,
  FaCheckCircle,
  FaSyncAlt,
  FaExclamationTriangle,
  FaCircle,
  FaInbox,
  FaClock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [stats, setStats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [technologie, setTechnologie] = useState([]);
  const [projetEncours, setProjetEncours] = useState([]);
  const [projetTermine, setProjetTermine] = useState([]);
  const [enAttente, setEnAttente] = useState([]);
  const [chartData, setChartData] = useState(null);

  // Récupération de l'ID utilisateur
  const userId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("userData");

  // Redirection si non connecté
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        };

        // Récupération des projets de l'utilisateur connecté uniquement
        const projectsResponse = await axios.get(
          `http://localhost:8080/manageWeb/projets/user/${userId}`,
          config
        );

        const projectsData = projectsResponse.data;
        const now = new Date();

        // Filtrage des projets par statut pour l'utilisateur connecté
        const projetsEnCours = projectsData.filter(
          (p) => p.statut === "EN_COURS"
        );
        const projetsTermines = projectsData.filter(
          (p) => p.statut === "TERMINE"
        );
        const projetsEnAttente = projectsData.filter(
          (p) => p.statut === "EN_ATTENTE"
        );

        // Calcul des statistiques uniquement pour les projets de l'utilisateur
        const completedProjects = projetsTermines.length;
        const lateProjects = projetsEnAttente.filter(
          (p) => p.dateLivraison && new Date(p.dateLivraison) < now
        ).length;
        const inProgressProjects = projetsEnCours.length;

        // Mise à jour du graphique
        setChartData({
          labels: ["Terminés", "En cours", "En retard"],
          datasets: [
            {
              label: "Mes projets",
              data: [completedProjects, inProgressProjects, lateProjects],
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 99, 132, 0.6)",
              ],
              borderWidth: 1,
            },
          ],
        });

        // Mise à jour des stats
        setStats([
          {
            title: "Mes projets terminés",
            value: completedProjects.toString(),
            icon: <FaCheckCircle className="text-green-500" />,
          },
          {
            title: "Mes projets en cours",
            value: inProgressProjects.toString(),
            icon: <FaSyncAlt className="text-blue-500" />,
          },
          {
            title: "Mes projets en retard",
            value: lateProjects.toString(),
            icon: <FaExclamationTriangle className="text-red-500" />,
          },
          {
            title: "Technologies utilisées",
            value: [
              ...new Set(projectsData.flatMap((p) => p.technologie || [])),
            ].length.toString(),
            icon: <FaProjectDiagram className="text-purple-500" />,
          },
        ]);

        // Tri des projets
        const sortedProjects = [...projectsData].sort((a, b) => {
          const statusOrder = {
            completed: 1,
            late: 2,
            "in-progress": 3,
            pending: 4,
          };
          return (
            statusOrder[getStatus(a.statut, a.dateLivraison)] -
            statusOrder[getStatus(b.statut, b.dateLivraison)]
          );
        });

        setProjects(
          sortedProjects.map((projet) => ({
            id: projet.id,
            name: projet.nom || "Projet sans nom",
            status: getStatus(projet.statut, projet.dateLivraison),
            progress: Number(projet.progression) || 0,
            deadline: projet.dateLivraison,
            members: projet.membresEquipe || [],
            technologies: projet.technologies || [],
          }))
        );

        // Mise à jour des listes
        setTechnologie([
          ...new Set(projectsData.flatMap((p) => p.technologie || [])),
        ]);
        setProjetEncours(
          projetsEnCours.map((p) => p.titre || "Projet sans nom")
        );
        setProjetTermine(
          projetsTermines.map((p) => p.titre || "Projet sans nom")
        );
        setEnAttente(projetsEnAttente.map((p) => p.titre || "Projet sans nom"));
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.response?.data?.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, authToken]);

  const getStatus = (statut, deadline) => {
    const now = new Date();
    const deliveryDate = deadline ? new Date(deadline) : null;

    if (deliveryDate && deliveryDate < now) return "completed";
    if (statut === "TERMINE") return "completed";
    if (statut === "EN_COURS") return "in-progress";
    return "pending";
  };

  // ... (le reste du code avec les rendus JSX reste identique à votre version originale)
  // Assurez-vous de bien conserver toutes vos fonctions de rendu existantes

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-6 mt-16">
          {/* Section Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <StatCard
                key={`stat-${index}`}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={stat.trend}
              />
            ))}
          </div>

          {/* Section Projets et Activité */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4">
            <div className="lg:col-span-2">
              <ProjectProgress projects={projects} />

              {/* Graphique en barres */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 mt-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Statistiques des projets
                </h3>
                {chartData && (
                  <div className="h-64">
                    <Bar
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "top",
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Actions rapides */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-md font-medium mb-3 text-gray-800">
                  Actions rapides
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate("/projects/new")}
                    className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-sm transition-colors"
                  >
                    + Créer un nouveau projet
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Technologies utilisées */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Technologies utilisées
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technologie.filter(Boolean).map((tech, index) => (
                    <span
                      key={`tech-${index}`}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projet en cours */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Projet en cours
                </h3>
                <div className="space-y-2">
                  {projetEncours.length > 0 ? (
                    projetEncours.map((projet, index) => (
                      <li
                        key={`encours-${index}`}
                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg text-sm font-medium text-blue-800 border border-blue-100 hover:shadow-md transition-all duration-200 flex items-center"
                      >
                        <FaCircle className="text-blue-400 mr-2 text-xs" />
                        {projet}
                      </li>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <FaInbox className="mx-auto text-gray-300 text-2xl mb-2" />
                      <span className="text-gray-400 italic">
                        Aucun projet en cours
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Projet terminé */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Projet terminé
                </h3>
                <div className="space-y-2">
                  {projetTermine.length > 0 ? (
                    projetTermine.map((projet, index) => (
                      <li
                        key={`termine-${index}`}
                        className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg text-sm font-medium text-green-800 border border-green-200 hover:shadow-sm transition-all duration-200 flex items-center group"
                      >
                        <FaCheckCircle className="text-green-500 mr-2 text-sm group-hover:text-green-600" />
                        <span className="flex-1">{projet}</span>
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs">
                          Terminé
                        </span>
                      </li>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <FaInbox className="mx-auto text-gray-300 text-2xl mb-2" />
                      <span className="text-gray-400 italic">
                        Aucun projet terminé pour l'instant
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Projet en attente */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Projet en retard
                </h3>
                <div className="space-y-2">
                  {enAttente.length > 0 ? (
                    enAttente.map((projet, index) => (
                      <li
                        key={`attente-${index}`}
                        className="px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg text-sm font-medium text-amber-800 border border-amber-200 hover:shadow-sm transition-all duration-200 flex items-center group"
                      >
                        <FaClock className="text-amber-500 mr-2 text-sm group-hover:text-amber-600" />
                        <span className="flex-1">{projet}</span>
                        <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full text-xs">
                          En attente
                        </span>
                      </li>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <FaClock className="mx-auto text-gray-300 text-2xl mb-2" />
                      <span className="text-gray-400 italic">
                        Aucun projet en attente
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
