package com.sp.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.sp.model.Caserne;
import com.sp.repository.CaserneRepository;
import com.sp.service.CaserneService;


@CrossOrigin
@RestController
@RequestMapping("/caserne")
public class CaserneCrtrl {

	@Autowired
	CaserneRepository cRepo;
	@Autowired
	CaserneService cService;
	
	@RequestMapping(method=RequestMethod.GET,value="/{id}") 
	public Caserne GetCaserne(@PathVariable Integer id , HttpServletResponse response,HttpServletRequest request) {
	  
		
		return cService.findById(id);
		
    }
	
	@RequestMapping(method=RequestMethod.GET,value="/getall") 
	public List<Caserne> GetCasernes(HttpServletResponse response,HttpServletRequest request) {
	  
		return cRepo.findAll();
		
    }
	
	
	
}
