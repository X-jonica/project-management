import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import ProjectTable from "../components/projects/ProjectTable";

export default function ProjectsPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-6 mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Projets</h2>
            <Link
              to="/projects/new"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Nouveau projet
            </Link>
          </div>
          <ProjectTable />
        </main>
      </div>
    </div>
  );
}
