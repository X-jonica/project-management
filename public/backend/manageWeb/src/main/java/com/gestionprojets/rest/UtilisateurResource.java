package com.gestionprojets.rest;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import metier.ProjetManager;
import metier.entities.Utilisateur;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Stateless
@Path("/")
public class UtilisateurResource {

    @EJB
    private ProjetManager projetBean;

    @POST
    @Path("/utilisateurs")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response inscrireUtilisateur(Utilisateur utilisateur) {
        try {
            projetBean.inscrireUtilisateur(utilisateur);
            return Response.status(Response.Status.CREATED)
                   .entity("{\"status\":\"success\",\"message\":\"Utilisateur créé avec succès\",\"id\":" + utilisateur.getId() + "}")
                   .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                   .entity("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}")
                   .build();
        }
    }

    @GET
    @Path("/utilisateurs/email/{email}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response trouverUtilisateurParEmail(@PathParam("email") String email) {
        Utilisateur utilisateur = projetBean.trouverUtilisateurParEmail(email);
        if (utilisateur == null) {
            return Response.status(Response.Status.NOT_FOUND)
                   .entity("{\"status\":\"error\",\"message\":\"Utilisateur non trouvé\"}")
                   .build();
        }
        return Response.ok(utilisateur).build();
    }
    
    @GET
    @Path("/utilisateurs")
    @Produces(MediaType.APPLICATION_JSON)
    public Response listerTousLesUtilisateurs() {
        List<Utilisateur> utilisateurs = projetBean.listerTousLesUtilisateurs();
        return Response.ok(utilisateurs).build();
    }
    
    @DELETE
    @Path("/utilisateurs/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response supprimerUtilisateur(@PathParam("id") Long id) {
        try {
            projetBean.supprimerUtilisateur(id);
            return Response.ok()
                   .entity("{\"status\":\"success\",\"message\":\"Utilisateur supprimé avec succès\"}")
                   .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                   .entity("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}")
                   .build();
        }
    }

    @PUT
    @Path("/utilisateurs/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response mettreAJourUtilisateur(Utilisateur utilisateur) {
        try {
            projetBean.mettreAJourUtilisateur(utilisateur);
            return Response.ok()
                   .entity("{\"status\":\"success\",\"message\":\"Utilisateur mis à jour avec succès\"}")
                   .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                   .entity("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}")
                   .build();
        }
    }
    
    @PUT
    @Path("utilisateurs/update/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response modifierUtilisateurParId(
        @PathParam("id") Long id, 
        Utilisateur utilisateurModifie) {
        
        try {
            Utilisateur updatedUser = projetBean.mettreAJourUtilisateurParId(id, utilisateurModifie);
            
            return Response.ok()
                   .entity(Json.createObjectBuilder()
                       .add("status", "success")
                       .add("message", "Utilisateur mis à jour avec succès")
                       .add("id", updatedUser.getId())
                       .add("nom", updatedUser.getNom())
                       .add("email", updatedUser.getEmail())
                       .add("role", updatedUser.getRole())
                       .add("mot_de_passe", updatedUser.getMot_de_passe())
                       .build())
                   .build();
                   
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                   .entity("{\"error\":\"" + e.getMessage() + "\"}")
                   .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                   .entity("{\"error\":\"Erreur lors de la mise à jour: " + e.getMessage() + "\"}")
                   .build();
        }
    }
    
    @POST
    @Path("/utilisateurs/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(Utilisateur utilisateur) {
        try {
            Utilisateur existingUser = projetBean.trouverUtilisateurParEmail(utilisateur.getEmail());
            
            if (existingUser == null || !existingUser.getMot_de_passe().equals(utilisateur.getMot_de_passe())) {
                return Response.status(Response.Status.UNAUTHORIZED)
                       .entity("{\"error\":\"Email ou mot de passe incorrect\"}")
                       .build();
            }
            
            // Création d'un objet JSON structuré
            JsonObject userJson = Json.createObjectBuilder()
                .add("id", existingUser.getId())
                .add("nom", existingUser.getNom())
                .add("email", existingUser.getEmail())
                .add("role", existingUser.getRole())
                .build();
            
            JsonObject responseJson = Json.createObjectBuilder()
                .add("status", "success")
                .add("user", userJson)
                .build();
            
            return Response.ok(responseJson).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                   .entity("{\"error\":\"Erreur lors de la connexion\"}")
                   .build();
        }
    }
    
    @GET
    @Path("/utilisateurs/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response trouverUtilisateurParId(@PathParam("id") Long id) {
        try {
            Utilisateur utilisateur = projetBean.trouverUtilisateurParId(id);
            if (utilisateur == null) {
                return Response.status(Response.Status.NOT_FOUND)
                       .entity("{\"status\":\"error\",\"message\":\"Utilisateur non trouvé\"}")
                       .build();
            }
            
            // Créez un DTO ou un Map avec seulement les données nécessaires
            Map<String, Object> response = new HashMap<>();
            response.put("id", utilisateur.getId());
            response.put("nom", utilisateur.getNom());
            response.put("email", utilisateur.getEmail());
            response.put("role", utilisateur.getRole());
            // Ajoutez d'autres champs nécessaires
            
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                   .entity("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}")
                   .build();
        }
    }
}