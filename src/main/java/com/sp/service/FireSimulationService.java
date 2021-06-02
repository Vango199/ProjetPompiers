package com.sp.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.project.model.dto.FireDto;
import com.project.model.dto.VehicleDto;
import com.sp.model.Vehicle;

@Service
public class FireSimulationService {

	public List<FireDto> getFire() {
		String UrlGetFires = "http://127.0.0.1:8081/fire";
		List<FireDto> ListFire = new RestTemplate().getForObject(UrlGetFires,List.class);//pas sûr que ca va marcher
		return ListFire;
	}
	
	public void resetFire() {
		String UrlResetFires = "http://127.0.0.1:8081/fire/reset";
		new RestTemplate().put( UrlResetFires, null);
		return ;
	}
	
	public VehicleDto PostVehicle(VehicleDto _vehicle) {
		String UrlPostVehicle = "http://127.0.0.1:8081/vehicle";
		ResponseEntity<VehicleDto> vDto = new RestTemplate().postForEntity(UrlPostVehicle, _vehicle, VehicleDto.class);
		return vDto.getBody();
	}
	
	public VehicleDto[] GetVehicle() {
		String UrlGetVehicle = "http://127.0.0.1:8081/vehicle";
		VehicleDto[] listVehicle = new RestTemplate().getForObject(UrlGetVehicle, VehicleDto[].class );
		return listVehicle;
	}
	
	public Vehicle GetVehicleById(Integer _vehicleId) {
		String UrlGetVehicle = "http://127.0.0.1:8081/vehicle/"+_vehicleId;
		Vehicle vehicle = new RestTemplate().getForObject(UrlGetVehicle, Vehicle.class );
		return vehicle;
	}
	
	public void PutVehicle( Vehicle _vehicle) {
		String UrlPutVehicle = "http://127.0.0.1:8081/vehicle/"+_vehicle.getId();
		new RestTemplate().put(UrlPutVehicle, _vehicle );
		return ;
	}
	
	public void DeleteVehicle( Vehicle _vehicle) {
		String UrlDeleteVehicle = "http://127.0.0.1:8081/vehicle/"+_vehicle.getId();
		new RestTemplate().delete(UrlDeleteVehicle);
		return ;
	}
	
	public void GetFireById(Integer _fireId) {
		
		List<FireDto> listFire = this.getFire();
//		for (FireDto)
		
	}
	
}
