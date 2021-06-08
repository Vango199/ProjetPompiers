package com.sp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.sp.model.Caserne;

import com.sp.repository.CaserneRepository;
;


@Service
public class CaserneService {

	CaserneRepository cRepository;
	
	public Caserne findById(Integer _id) {
		
		Optional<Caserne> cOpt =cRepository.findById(_id);
	    if (cOpt.isPresent()) {
	        return cOpt.get();
	    }else {
	        return null;
	    }
	}
	
	/*public List<Caserne> findAll(){
		List<Caserne> listCaserne = cRepository.findAll();
		return listCaserne;
	}*/
	
	
}
