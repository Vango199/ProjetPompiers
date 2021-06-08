package com.sp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.project.model.dto.LiquidType;
import com.project.model.dto.VehicleType;
import com.sp.model.Caserne;
import com.sp.model.Vehicle;
import com.sp.repository.CaserneRepository;
import com.sp.service.FireSimulationService;
import com.sp.service.VehicleService;

@Component
public class VehicleGenerator implements ApplicationRunner {
	@Autowired 
	VehicleService vService;
	@Autowired
	FireSimulationService fService;
	@Autowired
	CaserneRepository cRepo;
	public void run(ApplicationArguments args) throws Exception{
		
		vService.deleteAll();
		fService.resetFire();
		
		Caserne caserne1 = new Caserne(1,45.7578707,4.8555969);
		cRepo.save(caserne1);

		Vehicle vehicle1 = new Vehicle((int) 40.0,(double) 4.75,(double) 45.75,VehicleType.CAR,(float) 10,LiquidType.ALL,(float) 10.5,(float)10.5,(float)1,(float)10.5,(int)2,(int) 2,(Integer) 1,(Integer) 1);
		vService.PostVehicle(vehicle1);
		
		/*Vehicle vehicle2 = new Vehicle((int) 40.0,(double) 4.85,(double) 45.75,VehicleType.CAR,(float) 1,LiquidType.WATER,(float) 10.5,(float)10.5,(float)1,(float)10.5,(int)1,(int) 2,(Integer) 1);
		vService.PostVehicle(vehicle2);
		
		Vehicle vehicle3 = new Vehicle((int) 40.0,(double) 4.64,(double) 45.75,VehicleType.CAR,(float) 1,LiquidType.WATER,(float) 10.5,(float)10.5,(float)1,(float)10.5,(int)1,(int) 2,(Integer) 1);
		vService.PostVehicle(vehicle3);
		
		Vehicle vehicle4 = new Vehicle((int) 40.0,(double) 4.68,(double) 45.75,VehicleType.CAR,(float) 1,LiquidType.WATER,(float) 10.5,(float)10.5,(float)1,(float)10.5,(int)1,(int) 2,(Integer) 1);
		vService.PostVehicle(vehicle4);
		
		Vehicle vehicle5 = new Vehicle((int) 40.0,(double) 4.30,(double) 45.75,VehicleType.CAR,(float) 1,LiquidType.WATER,(float) 10.5,(float)10.5,(float)1,(float)10.5,(int)1,(int) 2,(Integer) 1);
		vService.PostVehicle(vehicle5);*/
	}
}
