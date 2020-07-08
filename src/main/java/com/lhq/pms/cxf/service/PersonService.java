package com.lhq.pms.cxf.service;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.lhq.pms.cxf.domain.Person;

@Produces( {MediaType.APPLICATION_JSON })
public interface PersonService {
    @POST
    @Path("/person/{name}")
    public Person getPerson(@PathParam("name") String name);
    //@POST
    @GET
    @Path("/persons")
    public List<Person> getPersons();
}