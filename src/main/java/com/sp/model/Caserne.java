package com.sp.model;

import java.util.List;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

public class Caserne {
	
	@ManyToMany

	@Id
	private Integer id;
	private double lon;
	private double lat;
	
	public Caserne() {}
	
	public Caserne (Integer id ,double lon, double lat) {
		this.id=id;
		this.lat=lat;
		this.lon = lon;
		
	
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
