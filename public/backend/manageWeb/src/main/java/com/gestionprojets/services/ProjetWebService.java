package com.gestionprojets.services;

import java.util.List;
import java.util.Map;

import jakarta.ejb.EJB;
import jakarta.jws.WebMethod;
import jakarta.jws.WebService;
import metier.ProjetManager;
import metier.entities.Projet;
import metier.entities.Utilisateur;

@WebService
public class ProjetWebService {

    @EJB
    private ProjetManager projetManager;

    // ===== Méthodes pour les Projets =====
    
    @WebMethod
    public String creerProjet(Projet projet) {
        try {
            // Vérifie que l'utilisateur existe
            Utilisateur utilisateur = projetManager.trouverUtilisateurParId(projet.getUtilisateur().getId());
            if (utilisateur == null) {
                return "{\"status\":\"error\",\"message\":\"Utilisateur introuvable\"}";
            }
            
            projetManager.creerProjet(projet);
            return "{\"status\":\"success\",\"message\":\"Projet créé avec succès\",\"id\":" + projet.getId() + "}";
        } catch (Exception e) {
            return "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}";
        }
    }

    @WebMethod
    public Projet trouverProjetParId(Long id) {
        return projetManager.trouverProjetParId(id);
    }

    @WebMethod
    public List<Projet> listerTousLesProjets() {
        return projetManager.listerTousLesProjets();
    }

    @WebMethod
    public List<Projet> listerProjetsParTechnologie(String technologie) {
        return projetManager.listerProjetsParTechnologie(technologie);
    }

    @WebMethod
    public List<Projet> listerProjetsParUtilisateur(Long userId) {
        return projetManager.getProjetsByUserId(userId);
    }

    @WebMethod
    public String mettreAJourProjet(Projet projet) {
        try {
            projetManager.mettreAJourProjet(projet);
            return "{\"status\":\"success\",\"message\":\"Projet mis à jour avec succès\"}";
        } catch (Exception e) {
            return "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}";
        }
    }

    @WebMethod
    public String supprimerProjet(Long id) {
        try {
            projetManager.supprimerProjet(id);
            return "{\"status\":\"success\",\"message\":\"Projet supprimé avec succès\"}";
        } catch (Exception e) {
            return "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}";
        }
    }

    @WebMethod
    public List<Projet> listerProjetsEnCours() {
        return projetManager.listerProjetsEnCours();
    }

    @WebMethod
    public List<Projet> listerProjetsTermines() {
        return projetManager.listerProjetsTermines();
    }

    @WebMethod
    public List<Projet> listerProjetsEnAttente() {
        return projetManager.listerProjetsEnAttente();
    }

    @WebMethod
    public Map<String, Long> obtenirStatistiques() {
        return projetManager.stat();
    }

    // ===== Méthodes pour les Utilisateurs =====
    
    @WebMethod
    public String inscrireUtilisateur(Utilisateur utilisateur) {
        try {
            projetManager.inscrireUtilisateur(utilisateur);
            return "{\"status\":\"success\",\"message\":\"Utilisateur créé avec succès\",\"id\":" + utilisateur.getId() + "}";
        } catch (Exception e) {
            return "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}";
        }
    }
    
    @WebMethod
    public Utilisateur trouverUtilisateurParEmail(String email) {
        return projetManager.trouverUtilisateurParEmail(email);
    }

    @WebMethod
    public Utilisateur trouverUtilisateurParId(Long id) {
        return projetManager.trouverUtilisateurParId(id);
    }

    @WebMethod
    public String mettreAJourUtilisateur(Utilisateur utilisateur) {
        try {
            projetManager.mettreAJourUtilisateur(utilisateur);
            return "{\"status\":\"success\",\"message\":\"Utilisateur mis à jour avec succès\"}";
        } catch (Exception e) {
            return "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}";
        }
    }

    @WebMethod
    public String supprimerUtilisateur(Long id) {
        try {
            projetManager.supprimerUtilisateur(id);
            return "{\"status\":\"success\",\"message\":\"Utilisateur supprimé avec succès\"}";
        } catch (Exception e) {
            return "{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}";
        }
    }

    @WebMethod
    public List<Utilisateur> listerTousLesUtilisateurs() {
        return projetManager.listerTousLesUtilisateurs();
    }

    @WebMethod
    public String connecterUtilisateur(String email, String motDePasse) {
        try {
            Utilisateur utilisateur = projetManager.connecterUtilisateur(email, motDePasse);
            if (utilisateur != null) {
                return String.format("{\"status\":\"success\",\"user\":{\"id\":%d,\"nom\":\"%s\",\"email\":\"%s\",\"role\":\"%s\"}}",
                    utilisateur.getId(),
                    utilisateur.getNom(),
                    utilisateur.getEmail(),
                    utilisateur.getRole());
            }
            return "{\"status\":\"error\",\"message\":\"Email ou mot de passe incorrect\"}";
        } catch (Exception e) {
            return "{\"status\":\"error\",\"message\":\"Erreur lors de la connexion\"}";
        }
    }
    
    @WebMethod
    public List<Projet> getProjetsEnCoursByUser(Long userId) {
        return projetManager.getProjetsEnCoursByUser(userId);
    }

    @WebMethod
    public List<Projet> getProjetsTerminesByUser(Long userId) {
        return projetManager.getProjetsTerminesByUser(userId);
    }

    @WebMethod
    public List<Projet> getProjetsEnAttenteByUser(Long userId) {
        return projetManager.getProjetsEnAttenteByUser(userId);
    }

    @WebMethod
    public List<Projet> getProjetsByUserAndStatut(Long userId, String statut) {
        return projetManager.getProjetsByUserAndStatut(userId, statut);
    }
}