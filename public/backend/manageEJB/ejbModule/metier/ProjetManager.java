package metier;

import java.util.List;
import java.util.Map;

import jakarta.ejb.Local;
import metier.entities.Projet;
import metier.entities.Utilisateur;

@Local
public interface ProjetManager {
    // CRUD Projet
    void creerProjet(Projet projet);
    Projet trouverProjetParId(Long id);
    List<Projet> listerTousLesProjets();
    List<Projet> listerProjetsParTechnologie(String technologie);
    void mettreAJourProjet(Projet projet);
    void supprimerProjet(Long id);
    
    // CRUD Utilisateur
    void inscrireUtilisateur(Utilisateur utilisateur);
    Utilisateur trouverUtilisateurParEmail(String email);
    void mettreAJourUtilisateur(Utilisateur utilisateur);
    void supprimerUtilisateur(Long id);
    
    // Liste tous les utilisateurs
    List<Utilisateur> listerTousLesUtilisateurs();
    
    // Trouve un utilisateur par son ID
    Utilisateur trouverUtilisateurParId(Long id);
    
    // *** Ajout de la méthode de login ***
    Utilisateur connecterUtilisateur(String email, String mot_de_passe);
    
    // ===== AJOUT =====
    Map<String, Long> stat();
    
    // Liste des projets en cours
    List<Projet> listerProjetsEnCours();

    // Liste des projets terminés
    List<Projet> listerProjetsTermines();

    // Liste des projets en attente
    List<Projet> listerProjetsEnAttente();
    
    // get les projets par utilisateur 
    List<Projet> getProjetsByUserId(Long userId);
    
 // Trouve les projets d'un utilisateur par statut
    List<Projet> getProjetsByUserAndStatut(Long userId, String statut);
    List<Projet> getProjetsEnCoursByUser(Long userId);
    List<Projet> getProjetsTerminesByUser(Long userId);
    List<Projet> getProjetsEnAttenteByUser(Long userId);
    
    //mise a jour par id 
    Utilisateur mettreAJourUtilisateurParId(Long id, Utilisateur utilisateurModifie);


}