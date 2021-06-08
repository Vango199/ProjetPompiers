package com.sp.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.project.model.dto.Coord;
import com.project.tools.GisTools;
import com.project.model.dto.FireDto;
import com.project.model.dto.VehicleDto;
import com.sp.model.Caserne;
import com.sp.model.CoordEm;
import com.sp.model.Etat;
import com.sp.model.Vehicle;
import com.sp.repository.CaserneRepository;
import com.sp.repository.VehicleRepository;


public class DisplayRunnable implements Runnable {
	private VehicleRepository vRepo;
	private VehicleService vService;
	boolean isEnd = false;
	private FireSimulationService fService;

	public DisplayRunnable(VehicleRepository vRepo,FireSimulationService fService,VehicleService vService) {
		this.vRepo = vRepo;
		this.fService=fService;
		this.vService= vService;
	}

	@Override
	public void run() {
		while (!this.isEnd) {//uyghgfchgvchgv
			try {
				Thread.sleep(10);
				this.vehicleToFire2();
				//this.vehicleToFire();
				
				
				for (Vehicle vehicle : this.vRepo.findAll()) {
					
					if(fService.GetFireById(vehicle.getIdFire())== null && vehicle.getEtat()==Etat.EteindFeu) {
						vehicle.setEtat(Etat.RetourCaserne);
						vehicle.setIdFire(0);
						vRepo.save(vehicle);
					}
					
					if (vehicle.getEtat()== Etat.RetourCaserne) {
						this.moveRetour(vehicle);
					}
						
					if(vehicle.getEtat() == Etat.versFeu ) {
						this.Move(vehicle);
					
					}
					
				}	
					//System.out.println(vehicle.getId());
				//}
			} catch (InterruptedException e) {
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		System.out.println("Runnable DisplayRunnable ends.... ");
	}

	public void stop() {
		this.isEnd = true;
	}
	
	public void Move2(Vehicle _vehicle) {
		System.out.println("try to move vehicle "+_vehicle.getId());
		
		double angle = 0;
		
		FireDto fire = fService.GetFireById(_vehicle.getIdFire());
		
		double deplacement = 0.000001;
		
		
		double latArriv = fire.getLat();
		double lonArriv = fire.getLon();
		
		if ((Math.abs(_vehicle.getLat()-latArriv)>deplacement) &&(Math.abs(_vehicle.getLon()-lonArriv)>deplacement)){
			System.out.println("Arrivé");
			_vehicle.setLat(latArriv);
			_vehicle.setLon(lonArriv);
			vService.PutVehicle(_vehicle);
		
		}
//		else {
//			//x>0 ety>0
//			if (((latArriv-_vehicle.getLat())> 0) && ((lonArriv-_vehicle.getLon())>0)) {
//				angle = Math.atan((lonArriv-_vehicle.getLon())/(latArriv-_vehicle.getLat()));
//			}
//				//x>0 et y<0
//			if (((latArriv-_vehicle.getLat())> 0) && ((lonArriv-_vehicle.getLon())<0)) {
//				angle = Math.atan((lonArriv-_vehicle.getLon())/(latArriv-_vehicle.getLat())) + 2* Math.PI;
//			}
//			//x<0
//			if((latArriv-_vehicle.getLat())< 0) {
//				angle = Math.atan((lonArriv-_vehicle.getLon())/(latArriv-_vehicle.getLat())) + Math.PI;
//			}
//			
//			_vehicle.setLat(Math.cos(angle)*deplacement+_vehicle.getLat());
//			_vehicle.setLon(Math.sin(angle)*deplacement+_vehicle.getLon());
//		
//
//			System.out.println("Vehicule "+_vehicle.getId()+"-->"+_vehicle.getLat()+","+_vehicle.getLon() );
//			
//			
//			System.out.println("Arrivée-->"+latArriv+","+lonArriv );
//			
//			//on put en repo et en simu le nouveau vehicle avec les coo actualisées
//			
//			vService.PutVehicle(_vehicle);
//			
//		}
//		
	}
	
	public void moveRetour(Vehicle _vehicle) {
		
		System.out.println("try to move to caserne vehicle "+_vehicle.getId());
		double angle = 0;
		if (_vehicle.getTrajetEtape()<_vehicle.getTrajet().size()) {
			
			int pointeurCoo = _vehicle.getTrajetEtape();
			System.out.println("pointeur:"+ pointeurCoo);
			double deplacement = 0.0001;
//			double latArriv = _vehicle.getTrajet().get(_vehicle.getTrajetEtape()).getLat();
//			double lonArriv = _vehicle.getTrajet().get(_vehicle.getTrajetEtape()).getLon();
			
			CoordEm coordArriv =_vehicle.getTrajet().get(_vehicle.getTrajetEtape());
			
			double latArriv = _vehicle.getTrajet().get(_vehicle.getTrajetEtape()).getLat();
			double lonArriv = _vehicle.getTrajet().get(_vehicle.getTrajetEtape()).getLon();
			
//			new GisTools();
//			//transpositions en coordonnées en metres	
//			Coord coordVehicle = new Coord(_vehicle.getLat(),_vehicle.getLon());
//			coordVehicle.setProjection("4326");
//			Coord coordArriv = new Coord(latArriv, lonArriv);
//			coordArriv.setProjection("4326");
//			
//			coordVehicle = GisTools.transformCoord(coordVehicle,"3857");
//			coordArriv = GisTools.transformCoord(coordArriv,"3857");
			
			//on rejoint le prochain checkpoint si on est assez près
			
			
			
			
			
			if ((Math.abs(_vehicle.getLat()-coordArriv.getLat())<deplacement) &&(Math.abs(_vehicle.getLon()-coordArriv.getLon())<deplacement)) {
				_vehicle.setTrajetEtape(_vehicle.getTrajetEtape()+1);
				_vehicle.setLat(coordArriv.getLat());
				_vehicle.setLon(coordArriv.getLon());
				
			}
			
			else  {
					
					//x>0 ety>0
					if (((coordArriv.getLat()-_vehicle.getLat())> 0) && ((coordArriv.getLon()-_vehicle.getLon())>0)) {
						angle = Math.atan((coordArriv.getLon()-_vehicle.getLon())/(coordArriv.getLat()-_vehicle.getLat()));
					}
						//x>0 et y<0
					if (((coordArriv.getLat()-_vehicle.getLat())> 0) && ((coordArriv.getLon()-_vehicle.getLon())<0)) {
						angle = Math.atan((coordArriv.getLon()-_vehicle.getLon())/(coordArriv.getLat()-_vehicle.getLat())) + 2* Math.PI;
					}
					//x<0
					if((coordArriv.getLat()-_vehicle.getLat())< 0) {
						angle = Math.atan((coordArriv.getLon()-_vehicle.getLon())/(coordArriv.getLat()-_vehicle.getLat())) + Math.PI;
					}
				
				
				//On actualise les coo
				//_vehicle.setLon(Math.cos(angle)*deplacement+_vehicle.getLon());
				//_vehicle.setLat(Math.sin(angle)*deplacement+_vehicle.getLat());
				
				
				_vehicle.setLat(Math.cos(angle)*deplacement+_vehicle.getLat());
				_vehicle.setLon(Math.sin(angle)*deplacement+_vehicle.getLon());
			}	
			
			
//			//on repasse en base lat long 
//			coordVehicle = GisTools.transformCoord(coordVehicle,"4326");
//			
//			_vehicle.setLat(coordVehicle.getLat());
//			_vehicle.setLon(coordVehicle.getLon());
//			
			
			
			System.out.println("Vehicule "+_vehicle.getId()+"-->"+_vehicle.getLat()+","+_vehicle.getLon() );
			
			
			System.out.println("Arrivée-->"+coordArriv.getLon()+","+coordArriv.getLat() );
			
			//on put en repo et en simu le nouveau vehicle avec les coo actualisées
			
			
		}
		
		else {
			
			
			CaserneService cService = new CaserneService();
			Caserne caserne = cService.findById(_vehicle.getIdCaserne());

			
			_vehicle.setLat(caserne.getLat());
			_vehicle.setLon(caserne.getLon());
			
			
			System.out.println("Arrivé à la caserne");
			_vehicle.setEtat(Etat.attenteCaserne);
		}
		vService.PutVehicle(_vehicle);
		
	}	

		
	
	
	
	
	
	
	public void Move(Vehicle _vehicle) {
		System.out.println("try to move vehicle "+_vehicle.getId());
		double angle = 0;
		if (_vehicle.getTrajetEtape()<_vehicle.getTrajet().size()) {
			
			int pointeurCoo = _vehicle.getTrajetEtape();
			System.out.println("pointeur:"+ pointeurCoo);
			double deplacement = 0.0001;
//			double latArriv = _vehicle.getTrajet().get(_vehicle.getTrajetEtape()).getLat();
//			double lonArriv = _vehicle.getTrajet().get(_vehicle.getTrajetEtape()).getLon();
			
			CoordEm coordArriv =_vehicle.getTrajet().get(_vehicle.getTrajetEtape());
			
			double latArriv = _vehicle.getTrajet().get(_vehicle.getTrajetEtape()).getLat();
			double lonArriv = _vehicle.getTrajet().get(_vehicle.getTrajetEtape()).getLon();
			
//			new GisTools();
//			//transpositions en coordonnées en metres	
//			Coord coordVehicle = new Coord(_vehicle.getLat(),_vehicle.getLon());
//			coordVehicle.setProjection("4326");
//			Coord coordArriv = new Coord(latArriv, lonArriv);
//			coordArriv.setProjection("4326");
//			
//			coordVehicle = GisTools.transformCoord(coordVehicle,"3857");
//			coordArriv = GisTools.transformCoord(coordArriv,"3857");
			
			//on rejoint le prochain checkpoint si on est assez près
			
			
			
			
			
			if ((Math.abs(_vehicle.getLat()-coordArriv.getLat())<deplacement) &&(Math.abs(_vehicle.getLon()-coordArriv.getLon())<deplacement)) {
				_vehicle.setTrajetEtape(_vehicle.getTrajetEtape()+1);
				_vehicle.setLat(coordArriv.getLat());
				_vehicle.setLon(coordArriv.getLon());
				
			}
			
			else if(_vehicle.getTrajetEtape()<=_vehicle.getTrajet().size()) {
					
					//x>0 ety>0
					if (((coordArriv.getLat()-_vehicle.getLat())> 0) && ((coordArriv.getLon()-_vehicle.getLon())>0)) {
						angle = Math.atan((coordArriv.getLon()-_vehicle.getLon())/(coordArriv.getLat()-_vehicle.getLat()));
					}
						//x>0 et y<0
					if (((coordArriv.getLat()-_vehicle.getLat())> 0) && ((coordArriv.getLon()-_vehicle.getLon())<0)) {
						angle = Math.atan((coordArriv.getLon()-_vehicle.getLon())/(coordArriv.getLat()-_vehicle.getLat())) + 2* Math.PI;
					}
					//x<0
					if((coordArriv.getLat()-_vehicle.getLat())< 0) {
						angle = Math.atan((coordArriv.getLon()-_vehicle.getLon())/(coordArriv.getLat()-_vehicle.getLat())) + Math.PI;
					}
				
				
				//On actualise les coo
				//_vehicle.setLon(Math.cos(angle)*deplacement+_vehicle.getLon());
				//_vehicle.setLat(Math.sin(angle)*deplacement+_vehicle.getLat());
				
				
				_vehicle.setLat(Math.cos(angle)*deplacement+_vehicle.getLat());
				_vehicle.setLon(Math.sin(angle)*deplacement+_vehicle.getLon());
			}	
			
			
//			//on repasse en base lat long 
//			coordVehicle = GisTools.transformCoord(coordVehicle,"4326");
//			
//			_vehicle.setLat(coordVehicle.getLat());
//			_vehicle.setLon(coordVehicle.getLon());
//			
			
			
			System.out.println("Vehicule "+_vehicle.getId()+"-->"+_vehicle.getLat()+","+_vehicle.getLon() );
			
			
			System.out.println("Arrivée-->"+coordArriv.getLon()+","+coordArriv.getLat() );
			
			//on put en repo et en simu le nouveau vehicle avec les coo actualisées
			
			
		}
		
		else {
			
			FireDto fire = fService.GetFireById(_vehicle.getIdFire());
			
			_vehicle.setLat(fire.getLat());
			_vehicle.setLon(fire.getLon());
			
			
			System.out.println("Arrivé à destination");
			_vehicle.setEtat(Etat.EteindFeu);
		}
		vService.PutVehicle(_vehicle);
		
	}	


	
	public void vehicleToFire() {

			FireDto[] listfiredto =fService.getFire();
			for (FireDto fireDto : listfiredto) {
				
				
				Vehicle vehicleRet = null;
				double distanceRet = 1000000000;
				Coord coordFire = new Coord(fireDto.getLat(),fireDto.getLat());
	
				for (Vehicle vehicle : this.vRepo.findAll()) {
					if (vehicle.getIdFire() == fireDto.getId()) {
						vehicleRet = null;
						break;
					}
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
	
	
	
	
	public void  vehicleToFire2() throws IOException {
		FireDto[] listfiredto =fService.getFire();
		for (FireDto fireDto : listfiredto) {
			
			Vehicle vehicleRet = null;
			double distanceRet = 0;
			double efficaciteRet = 0;
			int distance;
			Coord coordFire = new Coord(fireDto.getLon(),fireDto.getLat());
			

				// récupère la distance maximale
				for (Vehicle vehicle : this.vRepo.findAll()) {
					
					if (vehicle.getIdFire() == 0) {
						
						Coord coordVehicle = new Coord(vehicle.getLon(),vehicle.getLat());
						new GisTools();
						distance = GisTools.computeDistance2(coordVehicle, coordFire);
						
						if (distance > distanceRet) {
							distanceRet = distance;
							vehicleRet = vehicle;
						}
					}
				}
				//recupere le vehicule avec l'efficacité maximale
				for (Vehicle vehicle : this.vRepo.findAll()) {
				
						if (vehicle.getIdFire().doubleValue() == fireDto.getId().doubleValue()) {
							vehicleRet = null;
							break;
						}
						if (vehicle.getIdFire() == 0) {
							
							Coord coordVehicle = new Coord(vehicle.getLon(),vehicle.getLat());
							new GisTools();
							double efficacite =1 - GisTools.computeDistance2(coordVehicle, coordFire) / distanceRet;
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
					//vehicleRet.setIdFire(fireDto.getId());
					vService.addFireAndSetup(fireDto.getId(), vehicleRet.getId());
					//vRepo.save(vehicleRet);
				}
				
			
		}
		return ;
		
	}
	
	
	

	
	
	
}

