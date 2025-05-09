export default function ProjectProgress({ projects }) {
  const completedProjects = projects.filter(
    (project) => project.status === "completed"
  ).length;
  const progress = (completedProjects / projects.length) * 100;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 pb-6">
      <h3 className="text-lg font-semibold mb-4">Progression des projets</h3>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>{completedProjects} terminés</span>
        <span>{projects.length} au total</span>
      </div>
    </div>
  );
}
