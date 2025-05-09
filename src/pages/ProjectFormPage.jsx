import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import ProjectFormTable from "../components/projects/ProjectFormTable";

export default function ProjectFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    if (isEditing) {
      const fetchProject = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/manageWeb/projets/${id}`
          );
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          setInitialData(data);
        } catch (err) {
          console.error("Error fetching project:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    } else {
      setLoading(false);
    }
  }, [id, isEditing]);

  const handleSubmit = async (formData) => {
    try {
      const url = isEditing
        ? `http://localhost:8080/manageWeb/projets/${id}`
        : "http://localhost:8080/manageWeb/projets";

      const method = isEditing ? "PUT" : "POST"; 

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      navigate("/projects");
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("Erreur lors de la sauvegarde");
    }
  };

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

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-6 mt-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isEditing ? "Modifier le projet" : "Nouveau projet"}
          </h2>
          <ProjectFormTable
            isEditing={isEditing}
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/projects")}
          />
        </main>
      </div>
    </div>
  );
}
