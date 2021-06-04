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
		
		
		int deplacement = 5;
		double latArriv = _vehicle.getTrajet().get(_vehicle.getTrajetEtape()).get(0);
		double lonArriv = _vehicle.getTrajet().get(_vehicle.getTrajetEtape()).get(1);
		
		new GisTools();
		//transpositions en coordonnées en metres	
		Coord coordVehicle = new Coord(_vehicle.getLat(),_vehicle.getLon());
		coordVehicle.setProjection("4326");
		Coord coordArriv = new Coord(latArriv, lonArriv);
		coordArriv.setProjection("4326");
		
		coordVehicle = GisTools.transformCoord(coordVehicle,"3857");
		coordArriv = GisTools.transformCoord(coordArriv,"3857");
		
		
		if ((Math.abs(coordVehicle.getLat()-coordArriv.getLat())<deplacement) &&(Math.abs(coordVehicle.getLon()-coordArriv.getLon())<deplacement)) {
			_vehicle.setTrajetEtape(_vehicle.getTrajetEtape()+1);
			coordVehicle.setLat(coordArriv.getLat());
			coordVehicle.setLon(coordArriv.getLon());
			
		}
		else if (_vehicle.getTrajetEtape()<_vehicle.getTrajet().size()) {
			
		

			

			double angle = Math.atan((coordArriv.getLon()-coordVehicle.getLon())/(coordArriv.getLon()-coordVehicle.getLat()));
			
			//On actualise les coo
			coordVehicle.setLat(Math.cos(angle)*deplacement+coordVehicle.getLat());
			coordVehicle.setLon(Math.sin(angle)*deplacement+coordVehicle.getLon());
			
			
			
			
		
			
		}
		
		//on repasse en base lat long 
		coordVehicle = GisTools.transformCoord(coordVehicle,"4326");
		
		_vehicle.setLat(coordVehicle.getLat());
		_vehicle.setLon(coordVehicle.getLon());
		
		
		
		System.out.println("Vehicule "+_vehicle.getId()+"-->"+coordVehicle.getLat()+","+coordVehicle.getLon() );
		vRepo.save(_vehicle);
		
	}
	

	
	/*public void vehicleToFire() {
		FireDto[] listfiredto =fService.getFire();
		for (FireDto fireDto : listfiredto) {
			List<Vehicle> listvehicle = this.vRepo.findAll();
			Vehicle vehicleRet = null;
			double distanceRet = 10000;
			double latFire = fireDto.getLat();
			double lonFire = fireDto.getLon();
			//VehicleDto[] listvehicleDto = fService.GetVehicle();
			for (Vehicle vehicle : this.vRepo.findAll()) {
				double distance = Math.sqrt(Math.pow(latFire-vehicle.getLat(), 2)+(Math.pow(lonFire-vehicle.getLon(),2)) );
				if (distance < distanceRet) {
					distanceRet = distance;
					vehicleRet = vehicle;
				}
			}
			if (vehicleRet != null) {
				vehicleRet.setIdFire(fireDto.getId());
				vRepo.save(vehicleRet);
			}
			
		}
		
		
		
		// distance entre deux point : d(A,B)=√(x2−x1)²+(y2−y1)²
	}*/

}

