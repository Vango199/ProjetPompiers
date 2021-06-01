package com.sp.service;

import java.util.List;

import org.springframework.web.client.RestTemplate;

import com.project.model.dto.FireDto;
import com.project.model.dto.VehicleDto;


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
	
	public void PostVehicle(VehicleDto _vehicle) {
		String UrlPostVehicle = "http://127.0.0.1:8081/vehicle";
		new RestTemplate().postForEntity(UrlPostVehicle, _vehicle, null);
		return ;
	}
	
	public List<VehicleDto> GetVehicle() {
		String UrlGetVehicle = "http://127.0.0.1:8081/vehicle";
		List<VehicleDto> listVehicle = new RestTemplate().getForObject(UrlGetVehicle, List.class );
		return listVehicle;
	}
	
	public VehicleDto GetVehicleById(Integer _vehicleId) {
		String UrlGetVehicle = "http://127.0.0.1:8081/vehicle/"+_vehicleId;
		VehicleDto vehicle = new RestTemplate().getForObject(UrlGetVehicle, VehicleDto.class );
		return vehicle;
	}
	
	public void PutVehicle( VehicleDto _vehicle) {
		String UrlPutVehicle = "http://127.0.0.1:8081/vehicle/"+_vehicle.getId();
		new RestTemplate().put(UrlPutVehicle, _vehicle );
		return ;
	}
	
	public void DeleteVehicle( VehicleDto _vehicle) {
		String UrlDeleteVehicle = "http://127.0.0.1:8081/vehicle/"+_vehicle.getId();
		new RestTemplate().delete(UrlDeleteVehicle);
		return ;
	}
	
}
