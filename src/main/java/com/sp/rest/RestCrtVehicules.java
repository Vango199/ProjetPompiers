package com.sp.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.project.model.dto.FireDto;
import com.project.model.dto.VehicleDto;
import com.sp.model.Vehicle;
import com.sp.service.FireSimulationService;
import com.sp.service.VehicleService;

@RestController
@RequestMapping("/vehicle")
public class RestCrtVehicules {
	
	@Autowired
	VehicleService vService;
	
	@Autowired
	FireSimulationService fService;
	
	
	@RequestMapping("/hello")
	public String sayHello() {
		return "Hello Hero !!!";
	}
	//ajouter un véhicule
	@RequestMapping(method=RequestMethod.POST,value="") 
	public void PostVehicle(@RequestBody Vehicle _vehicle, HttpServletResponse response,HttpServletRequest request) {
	  
		vService.PostVehicle(_vehicle);
		return;
		
    }
	//modifier un véhicule
	@RequestMapping(method=RequestMethod.PUT,value="/{id}") 
	public void PutVehicle(@PathVariable Integer id , @RequestBody Vehicle _vehicle, HttpServletResponse response,HttpServletRequest request) {
	  
		vService.PutVehicle(_vehicle);
		return;
		
    }
	//get un véhicule
	@RequestMapping(method=RequestMethod.GET,value="/{id}") 
	public Vehicle GetVehicle(@PathVariable Integer id , HttpServletResponse response,HttpServletRequest request) {
	  
		
		return fService.GetVehicleById(id);
		
    }

}
