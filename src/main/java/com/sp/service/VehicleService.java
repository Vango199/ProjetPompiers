package com.sp.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.project.model.dto.FireDto;
import com.project.model.dto.VehicleDto;
import com.sp.model.Caserne;
import com.sp.model.CoordEm;
import com.sp.model.Vehicle;
import com.sp.repository.VehicleRepository;

import DTO.RouteDTO;
import DTO.recupMapboxDTO;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.model.dto.Coord;
@Service 
public class VehicleService {
	
	FireSimulationService fService;
	VehicleRepository vRepository;
	CaserneService cService;
	DisplayRunnable dRunnable;
	private Thread displayThread;
	

	public VehicleService(VehicleRepository vRepository,FireSimulationService fService, CaserneService cService) {
		//Replace the @Autowire annotation....
		this.vRepository=vRepository;
		this.fService=fService;
		this.cService = cService;
		//Create a Runnable is charge of executing cyclic actions 
		this.dRunnable=new DisplayRunnable(this.vRepository,this.fService, this,this.cService);
		
		// A Runnable is held by a Thread which manage lifecycle of the Runnable
		displayThread=new Thread(dRunnable);
		
		// The Thread is started and the method run() of the associated DisplayRunnable is launch
		displayThread.start();
		
	}

	
	public void PostVehicle(Vehicle _vehicle) {
		
		
		//fService.PostVehicle(this.toDto(_vehicle));
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
		Vehicle vehicletmp =vRepository.save(vehicle);
		fService.PutVehicle(this.toDto(vehicle));
		
	}

	public Vehicle findById(Integer _id) {
		
		Optional<Vehicle> vOpt =vRepository.findById(_id);
	    if (vOpt.isPresent()) {
	        return vOpt.get();
	    }else {
	        return null;
	    }
	}
	
	
	public Integer find(Integer _id) {
		
		Optional<Vehicle> vOpt =vRepository.findById(_id);
	    if (vOpt.isPresent()) {
	        return vOpt.get().getIdFire();
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
	
	
	public void deleteAll() {
		VehicleDto[] listVehicle = fService.GetVehicle();
		for(VehicleDto vehicleDto : listVehicle) {
			fService.DeleteVehicle(vehicleDto);
		}
		
	}

//ajout d'un feu au véhicle, et des coo du trajet
	public void addFireAndSetup(Integer idFire, Integer idVehicle) throws IOException {
		// TODO Auto-generated method stub
		Vehicle vehicle = this.findById(idVehicle);
		vehicle.setIdFire(idFire);
		FireDto fire = fService.GetFireById(idFire);
		
		//récupération des positions d'arrivée : celles du feu
		JsonNode route = this.getTrajetVJson(vehicle.getLat(), vehicle.getLon(),fire.getLat(), fire.getLon());
		
		
		ArrayList<CoordEm> ListRoute = new ArrayList<CoordEm>();
		for ( int i = 0;i< route.get("geometry").get("coordinates").size();i++) {
			
//			Coord coo = new Coord();
//			coo.setLat(route.get("geometry").get("coordinates").get(i).get(0).asDouble());
//			coo.setLon(route.get("geometry").get("coordinates").get(i).get(1).asDouble());
			
			CoordEm coo = new CoordEm();
			coo.setLat(route.get("geometry").get("coordinates").get(i).get(1).asDouble());
			coo.setLon(route.get("geometry").get("coordinates").get(i).get(0).asDouble());
	
			ListRoute.add(coo);
	    }
		
		
		
		vehicle.setTrajet(ListRoute);
		vehicle.setTrajetEtape(0);
		
		
		this.PutVehicle(vehicle);
		System.out.println("vehicle "+vehicle.getId()+"--> fire "+vehicle.getIdFire());
		
	}
	
	public void addTrajetRetour(Vehicle _vehicle) throws IOException {
		
		
		Caserne caserne = cService.findById(_vehicle.getIdCaserne());
		
		JsonNode route = this.getTrajetVJson(_vehicle.getLat(), _vehicle.getLon(),caserne.getLat(), caserne.getLon());
		
		
		ArrayList<CoordEm> ListRoute = new ArrayList<CoordEm>();
		for ( int i = 0;i< route.get("geometry").get("coordinates").size();i++) {
			
//			Coord coo = new Coord();
//			coo.setLat(route.get("geometry").get("coordinates").get(i).get(0).asDouble());
//			coo.setLon(route.get("geometry").get("coordinates").get(i).get(1).asDouble());
			
			CoordEm coo = new CoordEm();
			coo.setLat(route.get("geometry").get("coordinates").get(i).get(1).asDouble());
			coo.setLon(route.get("geometry").get("coordinates").get(i).get(0).asDouble());
	
			ListRoute.add(coo);
	    }
		
		
		
		_vehicle.setTrajet(ListRoute);
		_vehicle.setTrajetEtape(0);
		
		
		this.PutVehicle(_vehicle);
		System.out.println("vehicle "+_vehicle.getId()+"--> caserne "+_vehicle.getIdCaserne());
	}
	
//	public RouteDTO getTrajet(double intLat, double intLon, double finLat, double finLon) {
//		String UrlGetTrajet = "https://api.mapbox.com/directions/v5/mapbox/driving/"+String.valueOf(intLat)+","+String.valueOf(intLon)+"; "+String.valueOf(finLat)+","+String.valueOf(finLon)+"?overview=full&geometries=geojson&access_token=pk.eyJ1IjoidG90by1ldC1nYWJvdSIsImEiOiJja3BlMTJwMHIwM2RvMndvNjVjNWcyeTdkIn0.8DWPSvTRKHCwUmXACaZP0w";
//		System.out.println(UrlGetTrajet);
//		recupMapboxDTO recupMapBox= new RestTemplate().getForObject(UrlGetTrajet, recupMapboxDTO.class);
//		
//		RouteDTO route = recupMapBox.getListRoutes().get(0);
//		
//		
//		System.out.println("Distance:"+route.getDistance());
//		return route;
//	}
	
	public double getDistance (double intLat, double intLon, double finLat, double finLon) throws IOException {
		
		JsonNode route = this.getTrajetVJson(intLat, intLon,finLat, finLon);
		
		double distance  = route.get("distance").asDouble();
		
		
				
		return distance;
	}
	
	public double getDuration (double intLat, double intLon, double finLat, double finLon) throws IOException {
			
			JsonNode route = this.getTrajetVJson(intLat, intLon,finLat, finLon);
			
			double duration  = route.get("duration").asDouble();
			
			
					
			return duration;
	}
		
	
	public JsonNode getTrajetVJson(double intLat, double intLon, double finLat, double finLon) throws IOException {
		//String UrlGetTrajet = "https://api.mapbox.com/directions/v5/mapbox/driving/"+String.valueOf(intLat)+","+String.valueOf(intLon)+"; "+String.valueOf(finLat)+","+String.valueOf(finLon)+"?overview=full&geometries=geojson&access_token=pk.eyJ1IjoidG90by1ldC1nYWJvdSIsImEiOiJja3BlMTJwMHIwM2RvMndvNjVjNWcyeTdkIn0.8DWPSvTRKHCwUmXACaZP0w";
		String url_mapbox = "https://api.mapbox.com/directions/v5/mapbox/driving/";
		String mapboxSettings = "?geometries=geojson&access_token=";
		String mapboxKey = "pk.eyJ1IjoidG90by1ldC1nYWJvdSIsImEiOiJja3BlMTJwMHIwM2RvMndvNjVjNWcyeTdkIn0.8DWPSvTRKHCwUmXACaZP0w";
		String mapBoxKey2 ="pk.eyJ1IjoidmFuZ28xOTkiLCJhIjoiY2twbzMydzFqMGkzNzJ1bnV5Nnk0OXdybiJ9.otfKHVStVLsdIR_Mw6_Gpw";		
		String[] listToken = {mapboxKey,mapBoxKey2 };
		
		String url_request = url_mapbox + String.valueOf(intLon) + "," + String.valueOf(intLat)
		 + ";" + String.valueOf(finLon) + "," + String.valueOf(finLat)
		 + mapboxSettings + listToken[(int) (Math.random()*listToken.length)];

		
		String recupMapBox= new RestTemplate().getForObject(url_request, String.class);
		
		ObjectMapper objectMapper = new ObjectMapper();
		JsonNode jsn = objectMapper.readTree(recupMapBox);
		JsonNode jsonRoute = jsn.get("routes").get(0);
		
		//System.out.println("Weight " + jsonRoute.get("weight"));
		//System.out.println("Geom" + jsonRoute.get("geometry").get("coordinates").get(0));
		
//		for (JsonNode route : jsonroutes) {
//			System.out.println("Weight " + route.get("weight"));
//			System.out.println("Duration" + route.get("duration"));
//			
//		}
//		
		//RouteDTO route = recupMapBox.getListRoutes().get(0);
		
		
		//System.out.println("Distance:"+route.getDistance());
		return jsonRoute;
	}

	public void changeVehicle(Vehicle _vehicle) {
		// TODO Auto-generated method stub
		Vehicle vehicle = this.findById(_vehicle.getId());
		vehicle.setLat(_vehicle.getLat());
		vehicle.setLon(_vehicle.getLon());
		vehicle.setType(_vehicle.getType());
		vehicle.setLiquidType(_vehicle.getLiquidType());
		
		
		
		Vehicle vehicletmp =vRepository.save(vehicle);
		fService.PutVehicle(this.toDto(vehicle));
	}


//	public void Move(Vehicle _vehicle) {
//		
//		//récupération du feu associé
//		FireDto fire = fService.GetFireById(_vehicle.getIdFire());
//		
//		//récupération des positions d'arrivée : celles du feu
//		
//		int deplacement = 5;
//		
//		double latArriv = fire.getLat();
//		double lonArriv = fire.getLon();
//		
//		
//		double angle = Math.atan((lonArriv-_vehicle.getLon())/(latArriv-_vehicle.getLat()));
//		
//		//On actualise les coo
//		_vehicle.setLat(Math.cos(angle)*deplacement);
//		_vehicle.setLon(Math.sin(angle)*deplacement);
//		
//		
//		System.out.println("Vehicule "+_vehicle.getId()+"-->"+_vehicle.getLat()+","+_vehicle.getLon() );
//		vRepository.save(_vehicle);
//		
//	}
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

//associer vehicule a feu automatiquement(capacité type eau)
//créatiob vehicule au lancement
//deplacement en fonction de la carte
//
