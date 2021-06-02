package com.sp.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
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
	
	DisplayRunnable dRunnable;
	private Thread displayThread;
	

	public VehicleService(VehicleRepository vRepository) {
		//Replace the @Autowire annotation....
		this.vRepository=vRepository;
		
		//Create a Runnable is charge of executing cyclic actions 
		this.dRunnable=new DisplayRunnable(this.vRepository);
		
		// A Runnable is held by a Thread which manage lifecycle of the Runnable
		displayThread=new Thread(dRunnable);
		
		// The Thread is started and the method run() of the associated DisplayRunnable is launch
		displayThread.start();
		
	}

	
	public void PostVehicle(Vehicle _vehicle) {
		
		
		fService.PostVehicle(this.toDto(_vehicle));
		VehicleDto[] listVehicleDto = fService.GetVehicle();
//		TreeMap<VehicleDto, Integer> treeVehicleDto = new TreeMap<VehicleDto, Integer>();
//		treeVehicleDto.putAll(listVehicleDto);
		VehicleDto vehicleDtos=null;
		for(VehicleDto vehicleDto : listVehicleDto) {
			int idcomp = 0;
			if (idcomp < vehicleDto.getId()) {
				idcomp = vehicleDto.getId();
				vehicleDtos=vehicleDto;
			}
		}
		
		_vehicle.setId(vehicleDtos.getId());
		vRepository.save(_vehicle);
	}

	public void PutVehicle(Vehicle _vehicle) {
		Vehicle vehicle = this.findById(_vehicle.getId());
		vehicle= _vehicle;
		vRepository.save(vehicle);
		fService.PutVehicle(_vehicle);
		
	}

	public Vehicle findById(Integer _id) {
		
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
	
	public void stopDisplay() {
		//Call the user defined stop method of the runnable
		this.dRunnable.stop();
		try {
			//force the thread to stop
			this.displayThread.join(100);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	public void Move(Vehicle vehicle) {       
		return                                ;
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
