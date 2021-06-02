package com.sp.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.model.dto.VehicleDto;
import com.sp.model.Vehicle;
import com.sp.repository.VehicleRepository;

@Service 
public class VehicleService {
	
	@Autowired
	FireSimulationService fService;
	@Autowired
	VehicleRepository vRepository;
	
	public void PostVehicle(Vehicle _vehicle) {
		
		vRepository.save(_vehicle);
		fService.PostVehicle(_vehicle);
	}

	public void PutVehicle(Vehicle _vehicle) {
		Vehicle vehicle = this.findById(_vehicle.getId());
		vehicle= _vehicle;
		vRepository.save(vehicle);
		fService.PutVehicle(_vehicle);
		
	}

	private Vehicle findById(Integer _id) {
		
		Optional<Vehicle> vOpt =vRepository.findById(_id);
	    if (vOpt.isPresent()) {
	        return vOpt.get();
	    }else {
	        return null;
	    }
}
	
	
}
