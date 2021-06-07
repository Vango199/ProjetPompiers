package com.sp.model;

import java.util.List;

import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

public class Caserne {
	
	@ManyToMany
	@JoinTable(
			  name = "vehicle_caserne", 
			  joinColumns = @JoinColumn(name = "caserne_id"), 
			  inverseJoinColumns = @JoinColumn(name = "vehicle_id")
			  )
	
	private List<Vehicle> vehicles;
	@Id
	private Integer id;
	private double lon;
	private double lat;
	
	public Caserne() {}
	
	public Caserne (double lon, double lat) {
		
		this.lat=lat;
		this.lon = lon;
		
	
	}
	
	public Caserne (double lon, double lat, List<Vehicle> vehicles) {
		
		this.lat=lat;
		this.lon = lon;
		this.vehicles= vehicles;
	
	}
	
	
	public List<Vehicle> getVehicles() {
		return vehicles;
	}
	
	public void setVehicles(List<Vehicle> vehicles) {
		this.vehicles = vehicles;
	}
	
	public void addVehicle(Vehicle _vehicles) {
		this.vehicles.add(_vehicles) ;
	}
	public double getLon() {
		return lon;
	}
	public void setLon(double lon) {
		this.lon = lon;
	}
	public double getLat() {
		return lat;
	}
	public void setLat(double lat) {
		this.lat = lat;
	}
}
