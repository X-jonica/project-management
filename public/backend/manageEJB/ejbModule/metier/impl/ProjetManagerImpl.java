package metier.impl;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityTransaction;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import metier.ProjetManager;
import metier.entities.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Stateless(name = "MG")
public class ProjetManagerImpl implements ProjetManager {
    
    @PersistenceContext
    private EntityManager em;

    @Override
    public void creerProjet(Projet projet) {
        // Validation de base
        if (projet == null) {
            throw new IllegalArgumentException("Le projet ne peut pas être null");
        }
        // Un nouveau projet ne doit pas avoir d'ID
        if (projet.getId() != null) {
            throw new IllegalArgumentException("Un nouveau projet ne doit pas avoir d'ID");
        }
        // Titre obligatoire
        String titre = projet.getTitre();
        if (titre == null || titre.trim().isEmpty()) {
            throw new IllegalArgumentException("Le titre du projet est obligatoire");
        }
        // Vérification unicité du titre (tous utilisateurs confondus)
        Long count = em.createQuery(
                "SELECT COUNT(p) FROM Projet p WHERE p.titre = :titre", Long.class)
            .setParameter("titre", titre)
            .getSingleResult();
        if (count != null && count > 0) {
            throw new IllegalArgumentException(
                "Un projet avec ce titre existe déjà : '" + titre + "'");
        }
        // Validation utilisateur
        if (projet.getUtilisateur() == null || projet.getUtilisateur().getId() == null) {
            throw new IllegalArgumentException("Un utilisateur valide doit être associé au projet");
        }
        // Vérification existence de l'utilisateur
        Utilisateur utilisateur = em.find(
            Utilisateur.class, projet.getUtilisateur().getId());
        if (utilisateur == null) {
            throw new IllegalArgumentException("L'utilisateur spécifié n'existe pas");
        }
        // Dates : si date de création non fournie, on met aujourd'hui
        if (projet.getDateCreation() == null) {
            projet.setDateCreation(LocalDate.now());
        }
        // Si date de terminaison fournie, doit être après date de création
        LocalDate dc = projet.getDateCreation();
        LocalDate dt = projet.getDateTerminaison();
        if (dt != null && dt.isBefore(dc)) {
            throw new IllegalArgumentException(
                "La date de terminaison doit être postérieure à la date de création");
        }
        // Statut par défaut
        if (projet.getStatut() == null || projet.getStatut().trim().isEmpty()) {
            projet.setStatut("EN_ATTENTE");
        }
        // Technologie obligatoire
        if (projet.getTechnologie() == null || projet.getTechnologie().trim().isEmpty()) {
            throw new IllegalArgumentException("La technologie est obligatoire");
        }
        // Persistance
        em.persist(projet);
    }


    @Override
    public Projet trouverProjetParId(Long id) {
        return em.find(Projet.class, id);
    }

    @Override
    public List<Projet> listerTousLesProjets() {
        return em.createQuery("SELECT p FROM Projet p", Projet.class).getResultList();
    }

    @Override
    public List<Projet> listerProjetsParTechnologie(String technologie) {
        return em.createQuery("SELECT p FROM Projet p WHERE p.technologie = :tech", Projet.class)
                .setParameter("tech", technologie)
                .getResultList();
    }

    @Override
    public void mettreAJourProjet(Projet projet) {
        em.merge(projet);
    }

    @Override
    public void supprimerProjet(Long id) {
        Projet p = em.find(Projet.class, id);
        if (p != null) {
            em.remove(p);
        }
    }

    @Override
    public void inscrireUtilisateur(Utilisateur utilisateur) {
        // Vérifie que l'utilisateur n'a pas d'ID (nouvel utilisateur)
        if (utilisateur.getId() != null) {
            throw new IllegalArgumentException("L'ID utilisateur doit être null pour une nouvelle inscription");
        }
        
        // Vérifie que l'email n'existe pas déjà
        try {
            Utilisateur existant = trouverUtilisateurParEmail(utilisateur.getEmail());
            if (existant != null) {
                throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà");
            }
        } catch (NoResultException e) {
            // OK, email disponible
        }
        
        em.persist(utilisateur);
    }

    @Override
    public Utilisateur trouverUtilisateurParEmail(String email) {
        return em.createQuery("SELECT u FROM Utilisateur u WHERE u.email = :email", Utilisateur.class)
                .setParameter("email", email)
                .getSingleResult();
    }

    @Override
    public void mettreAJourUtilisateur(Utilisateur utilisateur) {
        em.merge(utilisateur);
    }
    

    @Override
    public Utilisateur mettreAJourUtilisateurParId(Long id, Utilisateur utilisateurModifie) {
        // 1. Récupérer l'utilisateur existant
        Utilisateur existingUser = em.find(Utilisateur.class, id);
        if (existingUser == null) {
            throw new IllegalArgumentException("Utilisateur non trouvé avec l'ID: " + id);
        }

        // 2. Vérifier l'unicité du nouvel email (si modifié)
        if (utilisateurModifie.getEmail() != null 
            && !utilisateurModifie.getEmail().equals(existingUser.getEmail())) {
            
            Long count = em.createQuery(
                "SELECT COUNT(u) FROM Utilisateur u WHERE u.email = :email AND u.id != :id", 
                Long.class)
                .setParameter("email", utilisateurModifie.getEmail())
                .setParameter("id", id)
                .getSingleResult();
                
            if (count > 0) {
                throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà");
            }
        }

        // 3. Mettre à jour les champs
        if (utilisateurModifie.getNom() != null) {
            existingUser.setNom(utilisateurModifie.getNom());
        }
        
        if (utilisateurModifie.getEmail() != null) {
            existingUser.setEmail(utilisateurModifie.getEmail());
        }
        
        if (utilisateurModifie.getMot_de_passe() != null) {
            existingUser.setMot_de_passe(utilisateurModifie.getMot_de_passe());
        }
        
        if (utilisateurModifie.getRole() != null) {
            existingUser.setRole(utilisateurModifie.getRole());
        }

        // La transaction est gérée automatiquement par le conteneur EJB
        return existingUser; // Pas besoin de merge, les changements sont suivis automatiquement
    }
    

    @Override
    public void supprimerUtilisateur(Long id) {
        Utilisateur u = em.find(Utilisateur.class, id);
        if (u != null) {
            em.remove(u);
        }
    }

    @Override
    public List<Utilisateur> listerTousLesUtilisateurs() {
        return em.createQuery("SELECT u FROM Utilisateur u", Utilisateur.class).getResultList();
    }
    
    public Map<String, Long> stat() {
        List<Object[]> results = em.createQuery(
            "SELECT p.technologie, COUNT(p) FROM Projet p GROUP BY p.technologie", Object[].class
        ).getResultList();

        Map<String, Long> stats = new HashMap<>();
        for (Object[] result : results) {
            stats.put((String) result[0], (Long) result[1]);
        }
        return stats;
    }
    
    @Override
    public List<Projet> listerProjetsEnCours() {
        // Supposons que tu utilises une EntityManager appelé em
        return em.createQuery("SELECT p FROM Projet p WHERE p.statut = :statut", Projet.class)
                 .setParameter("statut", "EN_COURS")
                 .getResultList();
    }

    @Override
    public List<Projet> listerProjetsTermines() {
        return em.createQuery("SELECT p FROM Projet p WHERE p.statut = :statut", Projet.class)
                 .setParameter("statut", "TERMINE")
                 .getResultList();
    }

    @Override
    public List<Projet> listerProjetsEnAttente() {
        return em.createQuery("SELECT p FROM Projet p WHERE p.statut = :statut", Projet.class)
                 .setParameter("statut", "EN_ATTENTE")
                 .getResultList();
    }


	@Override
	public Utilisateur trouverUtilisateurParId(Long id) {
		return em.find(Utilisateur.class, id);
	}

	@Override
	public Utilisateur connecterUtilisateur(String email, String mot_de_passe) {
	    try {
	        Utilisateur utilisateur = trouverUtilisateurParEmail(email);
	        // Vérifie seulement le mot de passe sans vérifier le rôle
	        if (utilisateur != null && utilisateur.getMot_de_passe().equals(mot_de_passe)) {
	            return utilisateur;
	        }
	        return null;
	    } catch (NoResultException e) {
	        return null; // Aucun utilisateur trouvé avec cet email
	    }
	}
	
	@Override
	public List<Projet> getProjetsByUserId(Long userId) {
		return em.createQuery("SELECT p FROM Projet p WHERE p.utilisateur.id = :userId", Projet.class)
	             .setParameter("userId", userId)
	             .getResultList();
	}
	
	@Override
    public List<Projet> getProjetsByUserAndStatut(Long userId, String statut) {
        return em.createQuery(
                "SELECT p FROM Projet p WHERE p.utilisateur.id = :userId AND p.statut = :statut", 
                Projet.class)
            .setParameter("userId", userId)
            .setParameter("statut", statut)
            .getResultList();
    }

    @Override
    public List<Projet> getProjetsEnCoursByUser(Long userId) {
        return getProjetsByUserAndStatut(userId, "EN_COURS");
    }

    @Override
    public List<Projet> getProjetsTerminesByUser(Long userId) {
        return getProjetsByUserAndStatut(userId, "TERMINE");
    }

    @Override
    public List<Projet> getProjetsEnAttenteByUser(Long userId) {
        return getProjetsByUserAndStatut(userId, "EN_ATTENTE");
    }


}