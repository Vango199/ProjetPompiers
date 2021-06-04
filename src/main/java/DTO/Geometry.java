package DTO;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import com.project.model.dto.Coord;



public class Geometry {
	

	
	private List<List<Double>> coordinates;
	
	

	public List<List<Double>> getCoordonnees() {
		return coordinates;
	}


	
}
