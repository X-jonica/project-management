package com.gestionprojets.rest;

import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.container.PreMatching;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
@PreMatching
@Priority(Priorities.HEADER_DECORATOR)
public class CorsFilter implements ContainerResponseFilter {

    @Override
    public void filter(jakarta.ws.rs.container.ContainerRequestContext requestContext,
                       ContainerResponseContext responseContext) throws IOException {
        // Autoriser ton frontend
        responseContext.getHeaders().add("Access-Control-Allow-Origin", "http://localhost:5173");
        // Si tu veux permettre les cookies / autorisation
        responseContext.getHeaders().add("Access-Control-Allow-Credentials", "true");
        // Méthodes autorisées
        responseContext.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        // En-têtes que le client peut envoyer
        responseContext.getHeaders().add("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
        // Facultatif : durée de mise en cache du preflight (en secondes)
        responseContext.getHeaders().add("Access-Control-Max-Age", "3600");
    }
}