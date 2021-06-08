package com.sp.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

import com.sp.model.Caserne;
import com.sp.model.Vehicle;



public interface CaserneRepository extends CrudRepository<Caserne, Integer>   {
	  
	public List<Caserne> findAll();
	
}