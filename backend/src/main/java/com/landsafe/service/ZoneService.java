package com.landsafe.service;

import com.landsafe.dto.RiskCalculationResultDto;
import com.landsafe.dto.ZoneDto;
import com.landsafe.entity.Device;
import com.landsafe.entity.Zone;
import com.landsafe.exception.ResourceNotFoundException;
import com.landsafe.repository.DeviceRepository;
import com.landsafe.repository.ZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ZoneService {

    private final ZoneRepository zoneRepository;
    private final DeviceRepository deviceRepository;
    private final RiskCalculationService riskCalculationService;

    public ZoneService(
            ZoneRepository zoneRepository,
            DeviceRepository deviceRepository,
            RiskCalculationService riskCalculationService) {
        this.zoneRepository = zoneRepository;
        this.deviceRepository = deviceRepository;
        this.riskCalculationService = riskCalculationService;
    }

    public List<ZoneDto> getAllZones() {
        return zoneRepository.findAll().stream()
                .map(this::mapToZoneDto)
                .collect(Collectors.toList());
    }

    public ZoneDto getZoneById(String zoneId) {
        Zone zone = zoneRepository.findByZoneId(zoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Zone not found with ID: " + zoneId));
        return mapToZoneDto(zone);
    }

    private ZoneDto mapToZoneDto(Zone zone) {
        List<Device> devices = deviceRepository.findByZoneId(zone.getZoneId());
        RiskCalculationResultDto risk = riskCalculationService.getCurrentRisk(zone.getZoneId());

        return ZoneDto.builder()
                .id(zone.getId())
                .zoneId(zone.getZoneId())
                .name(zone.getName())
                .description(zone.getDescription())
                .latitude(zone.getLatitude())
                .longitude(zone.getLongitude())
                .elevation(zone.getElevation())
                .risk(risk.getRiskLevel())
                .riskScore(risk.getRiskIndex())
                .advisory(risk.getReason())
                .deviceCount(devices.size())
                .createdAt(zone.getCreatedAt())
                .build();
    }
}
