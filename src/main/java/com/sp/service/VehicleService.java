package com.sp.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.project.model.dto.VehicleDto;
import com.sp.repository.VehicleRepository;

public class VehicleService {
	
	@Autowired
	FireSimulationService fService;
	VehicleRepository vRepository;
	
	public void PostVehicle(VehicleDto _vehicle) {
		
		vRepository.save(_vehicle);
		fService.PostVehicle(_vehicle);
	}

	public void PutVehicle(VehicleDto _vehicle) {
		VehicleDto vehicle = this.findById(_vehicle.getId());
		vehicle= _vehicle;
		vRepository.save(vehicle);
		fService.PutVehicle(_vehicle);
		
	}

	private VehicleDto findById(Integer _id) {
		
		Optional<VehicleDto> vOpt =vRepository.findById(_id);
	    if (vOpt.isPresent()) {
	        return vOpt.get();
	    }else {
	        return null;
	    }
}
	
	
}
