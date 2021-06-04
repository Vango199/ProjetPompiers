package com.sp.rest;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.model.dto.FireDto;
import com.project.model.dto.VehicleDto;
import com.sp.model.Vehicle;
import com.sp.repository.VehicleRepository;
import com.sp.service.FireSimulationService;
import com.sp.service.VehicleService;

@RestController
@RequestMapping("/vehicle")
public class RestCrtVehicules {
	
	@Autowired
	VehicleService vService;
	@Autowired
	VehicleRepository vRepository;
	@Autowired
	FireSimulationService fService;
	
	

	//ajouter un véhicule
	@RequestMapping(method=RequestMethod.POST,value="") 
	public void PostVehicle(@RequestBody Vehicle _vehicle, HttpServletResponse response,HttpServletRequest request) {
	  
		vService.PostVehicle(_vehicle);
		return;
		
    }
    @RequestMapping(method=RequestMethod.DELETE,value="/deletevehicle/{id}") 
	public void delete(@PathVariable Integer id,HttpServletResponse response,HttpServletRequest request) {
		Vehicle _vehicle = vService.findById(id);
    	VehicleDto vehicledto = vService.toDto(_vehicle);
    	fService.DeleteVehicle(vehicledto);
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
	  
		
		return vService.findById(id);
		
    }
	
	
	@RequestMapping(method=RequestMethod.GET,value="/getidfire/{id}") 
	public Integer GetidVehicle(@PathVariable Integer id , HttpServletResponse response,HttpServletRequest request) {
	  
		
		return vService.find(id);
		
    }
	
	@RequestMapping(method=RequestMethod.GET,value="/getall") 
	public List<Vehicle> GetVehicles(HttpServletResponse response,HttpServletRequest request){
		return vRepository.findAll();
	}
	
	
	
	@RequestMapping(method=RequestMethod.GET,value="/stopdisplay")
	public void stopDisplay() {
		vService.stopDisplay();
	}
	@RequestMapping(method=RequestMethod.PUT,value="/idfire")
	public void PutVehicle(Integer idFire ,Integer idVehicle, HttpServletResponse response,HttpServletRequest request) {
		Vehicle vehicle = vService.findById(idVehicle);
		vehicle.setIdFire(idFire);
		vRepository.save(vehicle);
	}


}
