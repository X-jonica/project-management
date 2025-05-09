import { useState, useEffect } from "react";

export default function ProjectFormTable({
  isEditing,
  initialData = {},
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    technologie: "",
    dateCreation: new Date().toISOString().split("T")[0], // "yyyy-MM-dd"
    dateTerminaison: "",
    statut: "EN_ATTENTE",
  });

  // Initialisation des données si on est en édition
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        titre: initialData.titre || "",
        description: initialData.description || "",
        technologie: initialData.technologie || "",
        dateCreation: initialData.dateCreation
          ? initialData.dateCreation.split("T")[0]
          : new Date().toISOString().split("T")[0],
        dateTerminaison: initialData.dateTerminaison
          ? initialData.dateTerminaison.split("T")[0]
          : "",
        statut: initialData.statut || "EN_ATTENTE",
      });
    }
  }, [isEditing, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification finale avant soumission
    if (formData.dateTerminaison) {
      const creation = new Date(formData.dateCreation);
      const termination = new Date(formData.dateTerminaison);

      if (termination < creation) {
        setError(
          "La date de terminaison ne peut pas être antérieure à la date de création"
        );
        return;
      }
    }

    // On n'ajoute plus de T00:00:00Z[UTC], on envoie juste "yyyy-MM-dd"
    const payload = {
      titre: formData.titre,
      description: formData.description,
      technologie: formData.technologie,
      dateCreation: formData.dateCreation,
      dateTerminaison: formData.dateTerminaison || null,
      statut: formData.statut, // ex. "EN_ATTENTE"
      utilisateur: { id: 1 }, // à remplacer dynamiquement
    };

    onSubmit(payload);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-3xl">
      <form onSubmit={handleSubmit}>
        {/* Titre */}
        <div className="mb-4">
          <label
            htmlFor="titre"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Titre du projet
          </label>
          <input
            id="titre"
            name="titre"
            type="text"
            required
            value={formData.titre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Technologie */}
        <div className="mb-4">
          <label
            htmlFor="technologie"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Technologies
          </label>
          <input
            id="technologie"
            name="technologie"
            type="text"
            required
            value={formData.technologie}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="dateCreation"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Date de création
            </label>
            <input
              id="dateCreation"
              name="dateCreation"
              type="date"
              required
              value={formData.dateCreation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="dateTerminaison"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Date de terminaison
            </label>
            <input
              id="dateTerminaison"
              name="dateTerminaison"
              type="date"
              value={formData.dateTerminaison}
              onChange={handleChange}
              min={formData.dateCreation} // Empêche de sélectionner une date antérieure
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Statut */}
        <div className="mb-6">
          <label
            htmlFor="statut"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Statut
          </label>
          <select
            id="statut"
            name="statut"
            required
            value={formData.statut}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="EN_ATTENTE">En attente</option>
            <option value="EN_COURS">En cours</option>
            <option value="TERMINE">Terminé</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isEditing ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </form>
    </div>
  );
}
