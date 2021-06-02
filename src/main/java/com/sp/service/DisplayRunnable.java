package com.sp.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.sp.model.Vehicle;
import com.sp.repository.VehicleRepository;


public class DisplayRunnable implements Runnable {
	@Autowired
	private VehicleRepository vRepo;
	@Autowired
	VehicleService vService;
	boolean isEnd = false;

	public DisplayRunnable(VehicleRepository vRepo) {
		this.vRepo = vRepo;
	}

	@Override
	public void run() {
		while (!this.isEnd) {
			try {
				Thread.sleep(10000);
				for (Vehicle vehicle : this.vRepo.findAll()) {
					if (vehicle.getIdFire().intValue() != 0) {
						vService.Move(vehicle);
					}
					System.out.println(vehicle.getId());
				}
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		
		System.out.println("Runnable DisplayRunnable ends.... ");
	}

	public void stop() {
		this.isEnd = true;
	}

}

