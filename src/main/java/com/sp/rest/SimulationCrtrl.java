package com.sp.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.project.model.dto.FireDto;
import com.sp.service.FireSimulationService;




@RestController
@RequestMapping("/simulation")

public class SimulationCrtrl {
	@Autowired
	FireSimulationService fService;

    
    @RequestMapping(method=RequestMethod.POST,value="/test")
    public void test1() {
        System.out.println("okokokokok");
    }
	
	
    @GetMapping("/test")
    public String test() {
        return "hello";
    }
    
    @RequestMapping(method=RequestMethod.GET,value="/fire/reset") 
	public void ResetFires(HttpServletResponse response,HttpServletRequest request) {
	  
		 fService.resetFire();
		
    }
	
    @RequestMapping(method=RequestMethod.GET,value="/fire") 
	public FireDto[] GetFires(HttpServletResponse response,HttpServletRequest request) {
	  
		 
		return fService.getFire();
		
    }
	
    @RequestMapping(method=RequestMethod.GET,value="/fire{id}") 

  	public FireDto GetFire(@PathVariable Integer id, HttpServletResponse response,HttpServletRequest request) {
  	  
  		 

  		return fService.GetFireById(id);
  		
      }
    
    
    @RequestMapping(method=RequestMethod.DELETE,value="/deleteallvehicle") 
	public void deleteAll(HttpServletResponse response,HttpServletRequest request) {
		 fService.deleteAll();
		 return;
		
    }	  
	
}

