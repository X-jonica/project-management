import moment from "moment";

export default function ProjectDetailsTable({ project }) {
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const cleanedDate = dateString.replace("[UTC]", "");
        return moment(cleanedDate).format("DD/MM/YYYY");
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            Description
                        </h2>
                        <p className="text-gray-600">{project.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">
                                Détails du projet
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <span className="font-medium text-gray-700">
                                        Statut:{" "}
                                    </span>
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            project.statut === "Completed"
                                                ? "bg-green-100 text-green-800"
                                                : project.statut ===
                                                  "In-progress"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {project.statut}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">
                                        Technologies:{" "}
                                    </span>
                                    <span className="text-gray-600">
                                        {project.technologie}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">
                                        Date de création:{" "}
                                    </span>
                                    <span className="text-gray-600">
                                        {formatDate(project.dateCreation)}
                                    </span>
                                </div>
                                {project.dateTerminaison && (
                                    <div>
                                        <span className="font-medium text-gray-700">
                                            Date de terminaison:{" "}
                                        </span>
                                        <span className="text-gray-600">
                                            {formatDate(
                                                project.dateTerminaison
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">
                                Responsable
                            </h2>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {project.utilisateur.nom.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {project.utilisateur.nom}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {project.utilisateur.email}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {project.utilisateur.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
