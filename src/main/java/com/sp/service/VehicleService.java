package com.sp.service;

import java.util.Map;
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
		
		
		fService.PostVehicle(this.toDto(_vehicle));
//		VehicleDto[] listVehicleDto = fService.GetVehicle(); Utile pour après
		VehicleDto vehicleDto=fService.PostVehicle(this.toDto(_vehicle));
//		for(VehicleDto vehicleDto : listVehicleDto) {
//			int idcomp = 0;
//			if (idcomp < vehicleDto.getId()) {
//				idcomp = vehicleDto.getId();
//				vehicleDtos=vehicleDto;
//			}
//		}
		
		_vehicle.setId(vehicleDto.getId());
		vRepository.save(_vehicle);
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
	
	public VehicleDto toDto(Vehicle vehicle) {
		VehicleDto vehicleDto = new VehicleDto(vehicle.getId(),vehicle.getLon(),vehicle.getLat(),vehicle.getType(),vehicle.getEfficiency(),vehicle.getLiquidType(),vehicle.getLiquidQuantity(),vehicle.getLiquidConsumption(),vehicle.getFuel(),vehicle.getFuelConsumption(),vehicle.getCrewMember(),vehicle.getCrewMemberCapacity(),vehicle.getFacilityRefID());
		return vehicleDto;
	}
	
	public void Moove (Vehicle _vehicle) {
		
		//récupération des positions d'arrivée : celles du feu
//		double lonArriv = fService. _vehicle.getIdFire()
	}
}


/*{
	 "id": 40.0,
	 "lon": 100,
	 "lat": 100,
	 "type": "CAR",
	 "efficiency" : 1,
	 "liquidTYpe": "ALL", 
	 "liquidQuantity": 10.5,
	 "liquidConsumption": 10.5,
	 "fuel":1,
	 "fuelConsumption": 10.5,
	 "crewMember": 1,
	 "crewMemberCapacity": 2,
	 "facilityRefID" : 1
	}*/
