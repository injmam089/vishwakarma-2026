package com.landsafe.service;

import com.landsafe.dto.ThresholdDto;
import com.landsafe.dto.UpdateThresholdsRequest;
import com.landsafe.entity.Threshold;
import com.landsafe.exception.BadRequestException;
import com.landsafe.exception.ResourceNotFoundException;
import com.landsafe.repository.ThresholdRepository;
import com.landsafe.repository.ZoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ThresholdService {

    private final ThresholdRepository thresholdRepository;
    private final ZoneRepository zoneRepository;

    public ThresholdService(ThresholdRepository thresholdRepository, ZoneRepository zoneRepository) {
        this.thresholdRepository = thresholdRepository;
        this.zoneRepository = zoneRepository;
    }

    public List<ThresholdDto> getThresholds(String zoneId) {
        if (!zoneRepository.existsByZoneId(zoneId)) {
            throw new ResourceNotFoundException("Zone not found: " + zoneId);
        }
        return thresholdRepository.findByZoneId(zoneId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<ThresholdDto> updateThresholds(String zoneId, UpdateThresholdsRequest request) {
        if (!zoneRepository.existsByZoneId(zoneId)) {
            throw new ResourceNotFoundException("Zone not found: " + zoneId);
        }

        List<ThresholdDto> updatedList = new ArrayList<>();

        for (UpdateThresholdsRequest.ThresholdItem item : request.getThresholds()) {
            if (item.getWarningValue() >= item.getCriticalValue()) {
                throw new BadRequestException("Warning threshold (" + item.getWarningValue() + ") must be strictly less than critical threshold (" + item.getCriticalValue() + ") for parameter: " + item.getParameter());
            }

            Threshold threshold = thresholdRepository.findByZoneIdAndParameter(zoneId, item.getParameter())
                    .orElse(Threshold.builder()
                            .zoneId(zoneId)
                            .parameter(item.getParameter())
                            .build());

            threshold.setWarningValue(item.getWarningValue());
            threshold.setCriticalValue(item.getCriticalValue());

            Threshold saved = thresholdRepository.save(threshold);
            updatedList.add(mapToDto(saved));
        }

        return updatedList;
    }

    public ThresholdDto mapToDto(Threshold threshold) {
        return ThresholdDto.builder()
                .id(threshold.getId())
                .zoneId(threshold.getZoneId())
                .parameter(threshold.getParameter())
                .warningValue(threshold.getWarningValue())
                .criticalValue(threshold.getCriticalValue())
                .build();
    }
}
