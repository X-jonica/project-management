package metier.entities;

import java.io.Serializable;
import java.lang.Long;
import java.lang.String;

import jakarta.json.bind.annotation.JsonbDateFormat;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;


/**
 * Entity implementation class for Entity: Projet
 *
 */
@Entity

public class Projet implements Serializable {

	   
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String titre;
	private String description;
	private String technologie;
	
	@JsonbDateFormat("yyyy-MM-dd")
	private LocalDate dateCreation;
	
	@JsonbDateFormat("yyyy-MM-dd")
	private LocalDate dateTerminaison;
	private String statut;
	
	@ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;
	
	private static final long serialVersionUID = 1L;

	public Projet() {
		super();
	}   
	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}   
	public String getTitre() {
		return this.titre;
	}

	public void setTitre(String titre) {
		this.titre = titre;
	}   
	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}   
	public String getTechnologie() {
		return this.technologie;
	}

	public void setTechnologie(String technologie) {
		this.technologie = technologie;
	}   
	public LocalDate getDateCreation() {
		return this.dateCreation;
	}

	public void setDateCreation(LocalDate dateCreation) {
		this.dateCreation = dateCreation;
	}   
	public LocalDate getDateTerminaison() {
		return this.dateTerminaison;
	}

	public void setDateTerminaison(LocalDate dateTerminaison) {
		this.dateTerminaison = dateTerminaison;
	}   
	public String getStatut() {
		return this.statut;
	}

	public void setStatut(String statut) {
		this.statut = statut;
	}   
	public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

   
}
