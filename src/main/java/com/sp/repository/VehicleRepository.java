package com.sp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.project.model.dto.VehicleDto;
import com.sp.model.Vehicle;


public interface VehicleRepository extends CrudRepository<Vehicle, Integer> {
  
	public List<Vehicle> findAll();
	
}