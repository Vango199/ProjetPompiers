package com.sp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.project.model.dto.Coord;
import com.project.tools.GisTools;
import com.project.model.dto.FireDto;
import com.project.model.dto.VehicleDto;
import com.sp.model.Vehicle;
import com.sp.repository.VehicleRepository;


public class DisplayRunnable implements Runnable {
	private VehicleRepository vRepo;
	//private VehicleService vService;
	boolean isEnd = false;
	private FireSimulationService fService;

	public DisplayRunnable(VehicleRepository vRepo,FireSimulationService fService) {
		this.vRepo = vRepo;
		this.fService=fService;
	}

	@Override
	public void run() {
		while (!this.isEnd) {//uyghgfchgvchgv
			try {
				Thread.sleep(1000);
				//this.vehicleToFire();
				//for (Vehicle vehicle : this.vRepo.findAll()) {
					/*if (vehicle.getIdFire().intValue() != 0) {
						this.Move(vehicle);
					}*/
					this.vehicleToFire2();
					//System.out.println(vehicle.getId());
				//}
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		
		System.out.println("Runnable DisplayRunnable ends.... ");
	}

	public void stop() {
		this.isEnd = true;
	}
	
	/*public void Move(Vehicle _vehicle) {
		
		//récupération du feu associé
		FireDto fire = fService.GetFireById(_vehicle.getIdFire());
		
		//récupération des positions d'arrivée : celles du feu
		
		
		
		double latArriv = fire.getLat();
		double lonArriv = fire.getLon();
		Coord coordvehicle = new Coord(_vehicle.getLat(),_vehicle.getLon());
		coordvehicle.setProjection("4326");
		Coord coordArriv = new Coord(latArriv, lonArriv);
		coordArriv.setProjection("4326");
		new GisTools();
		Coord newbasevehicle = GisTools.transformCoord(coordvehicle,"3857");
		Coord newbasefire = GisTools.transformCoord(coordArriv,"3857");
		//System.out.println(newbasevehicle.getLat());
		
		int deplacement = 5;
		double angle = Math.atan((newbasefire.getLon()-newbasevehicle.getLon())/(newbasefire.getLon()-newbasevehicle.getLat()));
		
		//On actualise les coo
		newbasevehicle.setLat(Math.cos(angle)*deplacement+newbasevehicle.getLat());
		newbasevehicle.setLon(Math.sin(angle)*deplacement+newbasevehicle.getLon());
		
		
		//On actualise les coo
		/*if ((latArriv-0.01 < _vehicle.getLat() &  _vehicle.getLat()< latArriv+0.01)) {

		}
		else {
			double deplacement = Math.random()*(5-1)+1;
			double angle = Math.atan((lonArriv-_vehicle.getLon())/(latArriv-_vehicle.getLat()));
			if (latArriv -_vehicle.getLat() < 0) {
				_vehicle.setLat(Math.cos(angle+Math.PI)*deplacement+_vehicle.getLat());
				_vehicle.setLon(Math.sin(angle+Math.PI)*deplacement+_vehicle.getLon());
			}
			else {
			_vehicle.setLat(Math.cos(angle)*deplacement+_vehicle.getLat());
			_vehicle.setLon(Math.sin(angle)*deplacement+_vehicle.getLon());
		
			}
		}
		System.out.println("Vehicule "+_vehicle.getId()+"-->"+newbasevehicle.getLat()+","+newbasevehicle.getLon() );
		vRepo.save(_vehicle);
		
	}*/
	
/*	public void vehicleToFire() {
		FireDto[] listfiredto =fService.getFire();
		for (FireDto fireDto : listfiredto) {
			Vehicle vehicleRet = null;
			double distanceRet = 1000000000;
			Coord coordFire = new Coord(fireDto.getLat(),fireDto.getLat());

			for (Vehicle vehicle : this.vRepo.findAll()) {
				
				if (vehicle.getIdFire() == 0) {
					
					Coord coordVehicle = new Coord(vehicle.getLat(),vehicle.getLat());
					new GisTools();
					int distance = GisTools.computeDistance2(coordVehicle, coordFire);
					
					if (distance < distanceRet) {
						distanceRet = distance;
						vehicleRet = vehicle;
					}
				}
			}
			
			if (vehicleRet != null) {
				vehicleRet.setIdFire(fireDto.getId());
				vRepo.save(vehicleRet);
			}

		}
	}
	*/
	
	public void  vehicleToFire2() {
		FireDto[] listfiredto =fService.getFire();
		for (FireDto fireDto : listfiredto) {
			
			Vehicle vehicleRet = null;
			double distanceRet = 1000000000;
			double efficaciteRet = 0;
			int distance;
			Coord coordFire = new Coord(fireDto.getLat(),fireDto.getLat());
			

				// récupère la distance maximale
				for (Vehicle vehicle : this.vRepo.findAll()) {
					
					if (vehicle.getIdFire() == 0) {
						
						Coord coordVehicle = new Coord(vehicle.getLat(),vehicle.getLat());
						new GisTools();
						distance = GisTools.computeDistance2(coordVehicle, coordFire);
						
						if (distance < distanceRet) {
							distanceRet = distance;
							vehicleRet = vehicle;
						}
					}
				}
				//recupere le vehicule avec l'efficaité maximale
				for (Vehicle vehicle : this.vRepo.findAll()) {
	
						if (vehicle.getIdFire() == 0) {
							
							Coord coordVehicle = new Coord(vehicle.getLat(),vehicle.getLat());
							new GisTools();
							double efficacite = GisTools.computeDistance2(coordVehicle, coordFire) / distanceRet;
							double sommeEfficacite = efficacite + (double) vehicle.getLiquidType().getEfficiency(fireDto.getType());
						
							if (efficaciteRet <= sommeEfficacite) {
								if (efficaciteRet == sommeEfficacite) {
									if (vehicle.getLiquidType().getEfficiency(fireDto.getType()) > vehicleRet.getLiquidType().getEfficiency(fireDto.getType())) {
										efficaciteRet= sommeEfficacite;
										vehicleRet = vehicle;	
									}
								}
								else {
									efficaciteRet= sommeEfficacite;
									vehicleRet = vehicle;
								}
							}
		
						}
	
					
				}
				if (vehicleRet != null) {
					vehicleRet.setIdFire(fireDto.getId());
					vRepo.save(vehicleRet);
				}
				
			
		}
		return ;
	}
	
	
	
}

