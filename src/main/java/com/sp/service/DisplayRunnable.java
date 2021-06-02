package com.sp.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.project.model.dto.FireDto;
import com.sp.model.Vehicle;
import com.sp.repository.VehicleRepository;


public class DisplayRunnable implements Runnable {
	private VehicleRepository vRepo;
	private VehicleService vService;
	boolean isEnd = false;
	private FireSimulationService fService;

	public DisplayRunnable(VehicleRepository vRepo,FireSimulationService fService) {
		this.vRepo = vRepo;
		this.fService=fService;
	}

	@Override
	public void run() {
		while (!this.isEnd) {
			try {
				Thread.sleep(10000);
				for (Vehicle vehicle : this.vRepo.findAll()) {
					if (vehicle.getIdFire().intValue() != 0) {
						this.Move(vehicle);
					}
					System.out.println(vehicle.getId());
				}
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		
		System.out.println("Runnable DisplayRunnable ends.... ");
	}

	public void stop() {
		this.isEnd = true;
	}
	
	public void Move(Vehicle _vehicle) {
		
		//récupération du feu associé
		FireDto fire = fService.GetFireById(_vehicle.getIdFire());
		
		//récupération des positions d'arrivée : celles du feu
		
		int deplacement = 5;
		
		double latArriv = fire.getLat();
		double lonArriv = fire.getLon();
		
		
		double angle = Math.atan((lonArriv-_vehicle.getLon())/(latArriv-_vehicle.getLat()));
		
		//On actualise les coo
		_vehicle.setLat(Math.cos(angle)*deplacement);
		_vehicle.setLon(Math.sin(angle)*deplacement);
		
		
		System.out.println("Vehicule "+_vehicle.getId()+"-->"+_vehicle.getLat()+","+_vehicle.getLon() );
		vRepo.save(_vehicle);
		
	}

}

