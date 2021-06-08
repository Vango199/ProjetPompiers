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
		
		Caserne caserne1 = new Caserne(1,4.8555969,45.7578707);
		cRepo.save(caserne1);
		
		Caserne caserne2 = new Caserne(2,4.765775,45.759839);
		cRepo.save(caserne2);
		
		Caserne caserne3 = new Caserne(3,4.909235,45.733753 );
		cRepo.save(caserne3);

		Vehicle vehicle1 = new Vehicle((int) 40.0,(double) 4.8555969,(double) 45.7578707,VehicleType.CAR,(float) 10,LiquidType.ALL,(float) 10.5,(float)10.5,(float)30,(float)0.5,(int)2,(int) 2,(Integer) 1,(Integer) 1);
		vService.PostVehicle(vehicle1);
		
		Vehicle vehicle2 = new Vehicle((int) 40.0,(double) 4.8555969,(double) 45.7578707,VehicleType.CAR,(float) 10,LiquidType.ALL,(float) 10.5,(float)10.5,(float)30,(float)0.5,(int)2,(int) 2,(Integer) 1,(Integer) 1);
		vService.PostVehicle(vehicle2);
		
		Vehicle vehicle3 = new Vehicle((int) 40.0,(double) 4.765775,(double) 45.759839,VehicleType.CAR,(float) 10,LiquidType.ALL,(float) 10.5,(float)10.5,(float)30,(float)0.5,(int)2,(int) 2,(Integer) 1,(Integer) 2);
		vService.PostVehicle(vehicle3);
		
		Vehicle vehicle4 = new Vehicle((int) 40.0,(double) 4.765775,(double) 45.759839,VehicleType.CAR,(float) 10,LiquidType.ALL,(float) 10.5,(float)10.5,(float)30,(float)0.5,(int)2,(int) 2,(Integer) 1,(Integer) 2);
		vService.PostVehicle(vehicle4);
		
		Vehicle vehicle5 = new Vehicle((int) 40.0,(double) 4.909235,(double) 45.733753 ,VehicleType.CAR,(float) 10,LiquidType.ALL,(float) 10.5,(float)10.5,(float)100,(float)0.5,(int)2,(int) 2,(Integer) 1,(Integer) 3);
		vService.PostVehicle(vehicle5);
	}
}
