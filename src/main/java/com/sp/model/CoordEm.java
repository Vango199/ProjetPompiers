package com.sp.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import com.project.model.dto.Coord;

 @Entity
public class CoordEm {
	@Id
	@GeneratedValue
	private Integer id;
	private double lat;
	private double lon;
	
	
	public CoordEm() {
	}
	
	public CoordEm(Coord c) {
		lat=c.getLat();
		lon=c.getLon();
	}

	public double getLat() {
		return lat;
	}

	public void setLat(double lat) {
		this.lat = lat;
	}

	public double getLon() {
		return lon;
	}

	public void setLon(double lon) {
		this.lon = lon;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}	
	

}
