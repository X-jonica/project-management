export default function Header() {
  // Récupère les données utilisateur depuis localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));

  return (
    <header className="bg-white shadow-sm fixed top-0 left-64 right-0 z-10 p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">Tableau de bord</h2>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <span className="text-gray-600">🔔</span>
        </button>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
            {/* Première lettre du nom */}
            {userData?.nom?.charAt(0) || "U"}
          </div>
          <span className="ml-2 text-gray-700">
            {/* Nom complet ou "Utilisateur" par défaut */}
            {userData?.nom || "Utilisateur"}
          </span>
        </div>
      </div>
    </header>
  );
}
