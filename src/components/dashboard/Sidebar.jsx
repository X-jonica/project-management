import { Link, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const navItems = [
    { path: "/dashboard", name: "Dashboard", icon: "🏠" },
    { path: "/projects", name: "Projets", icon: "📋" },
    { path: "/account", name: " Compte", icon: <FaUser /> },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 p-4">
      <h1 className="text-2xl font-bold mb-8">Mon Application</h1>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-2">
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded hover:bg-gray-700 ${
                  location.pathname === item.path ? "bg-gray-700" : ""
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
