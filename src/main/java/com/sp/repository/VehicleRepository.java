package com.sp.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.project.model.dto.VehicleDto;


public interface VehicleRepository extends CrudRepository<VehicleDto, Integer> {
  

}