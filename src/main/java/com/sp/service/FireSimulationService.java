package com.sp.service;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.LinkedHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.project.model.dto.FireDto;
import com.project.model.dto.VehicleDto;
import com.sp.model.Vehicle;
import com.sp.repository.VehicleRepository;

@Service
public class FireSimulationService {

	
	VehicleRepository vRepository;
	
	VehicleService vService;
	
	
	
	public FireDto[] getFire() {
		String UrlGetFires = "http://127.0.0.1:8081/fire/";
		FireDto[] ListFire = new RestTemplate().getForObject(UrlGetFires,FireDto[].class);
		return ListFire;
	}
	
	public void resetFire() {
		String UrlResetFires = "http://127.0.0.1:8081/fire/reset";
		 RestTemplate restemplate = new RestTemplate();
		 restemplate.getForEntity(UrlResetFires, null, new Object[] {});
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
	
	public void PutVehicle( VehicleDto _vehicle) {
		String UrlPutVehicle = "http://127.0.0.1:8081/vehicle/"+_vehicle.getId();
		HttpHeaders headers = new HttpHeaders();
		headers.add("Accept", MediaType.APPLICATION_JSON_VALUE);
		HttpEntity<VehicleDto> request = new HttpEntity<>(_vehicle,headers );
		new RestTemplate().put(UrlPutVehicle, request );
		return ;
	}
	
	public void DeleteVehicle( VehicleDto _vehicle) {
		String UrlDeleteVehicle = "http://127.0.0.1:8081/vehicle/"+String.valueOf(_vehicle.getId());
		new RestTemplate().delete(UrlDeleteVehicle);
		
		
		return ;
	}



	public void deleteAll() {
		VehicleDto[] listVehicle = this.GetVehicle();
		for(VehicleDto vehicleDto : listVehicle) {
			this.DeleteVehicle(vehicleDto);
		}
		
	}
	
	public FireDto GetFireById(Integer _fireId) {
		
		FireDto fireDtoToRet = null;
		FireDto[] listFire = this.getFire();
		for (FireDto fireDto: listFire) {
			if (fireDto.getId()==_fireId) {
				fireDtoToRet=fireDto;
				break;
			}
		}
		return fireDtoToRet;
		
	}
	
	public List<Integer> getlistidFire(FireDto firedto){
		
		List<Integer> listidfire = new ArrayList<Integer>();
		FireDto[] listfiredto =this.getFire();
		for (FireDto fireDto : listfiredto) {
			listidfire.add(fireDto.getId());
		}
		
	
	return listidfire;
	
	}
	
	/*public FireDto fire_vehicle() {
		FireDto fireDtoToRet = null;
		FireDto[] listFire = this.getFire();
		
		Vehicle vehicle = vService.find
	}*/
	
	
	
	
}
