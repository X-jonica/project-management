package com.gestionprojets.rest;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import metier.ProjetManager;
import metier.entities.Projet;
import java.util.List;
import java.util.Map;

@Stateless
@Path("/")
public class ProjetResource {

    @EJB
    private ProjetManager projetSBean;
    
    @GET
    @Path("/projets")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProjets() {
        List<Projet> projets = projetSBean.listerTousLesProjets();
        return Response.ok(projets).build();
    }

    @GET
    @Path("/projets/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjetById(@PathParam("id") Long id) {
        Projet projet = projetSBean.trouverProjetParId(id);
        if (projet == null) {
            return Response.status(Response.Status.NOT_FOUND)
                   .entity("{\"message\":\"Projet non trouvé\"}")
                   .build();
        }
        return Response.ok(projet).build();
    }

    @POST
    @Path("/projets")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response creerProjet(Projet projet) {
        try {
            projetSBean.creerProjet(projet);
            return Response.status(Response.Status.CREATED)
                   .entity("{\"status\":\"success\",\"message\":\"Projet créé avec succès\",\"id\":" + projet.getId() + "}")
                   .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                   .entity("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}")
                   .build();
        }
    }

    @PUT
    @Path("/projets/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response mettreAJourProjet(@PathParam("id") Long id, Projet projet) {
        try {
            projet.setId(id);
            projetSBean.mettreAJourProjet(projet);
            return Response.ok()
                   .entity("{\"status\":\"success\",\"message\":\"Projet mis à jour avec succès\"}")
                   .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                   .entity("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}")
                   .build();
        }
    }

    @DELETE
    @Path("/projets/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response supprimerProjet(@PathParam("id") Long id) {
        try {
            projetSBean.supprimerProjet(id);
            return Response.ok()
                   .entity("{\"status\":\"success\",\"message\":\"Projet supprimé avec succès\"}")
                   .build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                   .entity("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}")
                   .build();
        }
    }
    
    @GET
    @Path("/projets/stat")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getStat() {
        Map<String, Long> stats = projetSBean.stat();
        return Response.ok(stats).build();
    }
    
    @GET
    @Path("/projets/en_cours")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjetsEnCours() {
        List<Projet> projetsEnCours = projetSBean.listerProjetsEnCours();
        return Response.ok(projetsEnCours).build();
    }

    @GET
    @Path("/projets/termines")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjetsTermines() {
        List<Projet> projetsTermines = projetSBean.listerProjetsTermines();
        return Response.ok(projetsTermines).build();
    }

    @GET
    @Path("/projets/en_attente")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjetsEnAttente() {
        List<Projet> projetsEnAttente = projetSBean.listerProjetsEnAttente();
        return Response.ok(projetsEnAttente).build();
    }
    
    @GET
    @Path("/projets/user/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjetsByUser(@PathParam("userId") Long userId) {
        try {
            List<Projet> projets = projetSBean.	getProjetsByUserId(userId);
            
            if (projets == null || projets.isEmpty()) {
                return Response.status(Response.Status.NOT_FOUND)
                       .entity("{\"status\":\"success\",\"message\":\"Aucun projet trouvé pour cet utilisateur\"}")
                       .build();
            }
            
            return Response.ok(projets).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                   .entity("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}")
                   .build();
        }
    }
    
    @GET
    @Path("/projets/user/{userId}/en_cours")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjetsEnCoursByUser(@PathParam("userId") Long userId) {
        try {
            List<Projet> projets = projetSBean.getProjetsEnCoursByUser(userId);
            return Response.ok(projets).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                   .entity("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}")
                   .build();
        }
    }

    @GET
    @Path("/projets/user/{userId}/termines")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjetsTerminesByUser(@PathParam("userId") Long userId) {
        try {
            List<Projet> projets = projetSBean.getProjetsTerminesByUser(userId);
            return Response.ok(projets).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                   .entity("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}")
                   .build();
        }
    }

    @GET
    @Path("/projets/user/{userId}/en_attente")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjetsEnAttenteByUser(@PathParam("userId") Long userId) {
        try {
            List<Projet> projets = projetSBean.getProjetsEnAttenteByUser(userId);
            return Response.ok(projets).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                   .entity("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}")
                   .build();
        }
    }

    @GET
    @Path("/projets/user/{userId}/statut/{statut}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjetsByUserAndStatut(
            @PathParam("userId") Long userId, 
            @PathParam("statut") String statut) {
        try {
            List<Projet> projets = projetSBean.getProjetsByUserAndStatut(userId, statut);
            return Response.ok(projets).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                   .entity("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}")
                   .build();
        }
    }
}