package CampusShield.service;

import CampusShield.exception.ResourceNotFoundException;
import CampusShield.model.*;
import CampusShield.repository.IncidentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public Page<Incident> getAllIncidents(Pageable pageable) {
        return incidentRepository.findAll(pageable);
    }

    public List<Incident> getAllIncidentsList() {
        return incidentRepository.findAll();
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident record #" + id + " not found"));
    }

    public Incident reportIncident(Incident incident) {
        if (incident.isAnonymous()) {
            incident.setReporterName("Anonymous Student");
            incident.setReporterEmail("protected@campusshield.internal");
        }
        incident.setStatus(IncidentStatus.REPORTED);
        incident.setCreatedAt(LocalDateTime.now());
        incident.setUpdatedAt(LocalDateTime.now());
        return incidentRepository.save(incident);
    }

    public Incident updateStatus(Long id, IncidentStatus status, String remarks, String faculty) {
        Incident incident = getIncidentById(id);
        incident.setStatus(status);
        if (remarks != null && !remarks.isBlank()) {
            incident.setResolutionRemarks(remarks.trim());
        }
        if (faculty != null && !faculty.isBlank()) {
            incident.setAssignedFaculty(faculty.trim());
        }
        if (status == IncidentStatus.RESOLVED) {
            incident.setResolvedAt(LocalDateTime.now());
        }
        return incidentRepository.save(incident);
    }

    public Incident assignFaculty(Long id, String faculty, IncidentPriority priority) {
        Incident incident = getIncidentById(id);
        if (faculty != null && !faculty.isBlank()) {
            incident.setAssignedFaculty(faculty.trim());
            if (incident.getStatus() == IncidentStatus.REPORTED) {
                incident.setStatus(IncidentStatus.UNDER_INVESTIGATION);
            }
        }
        if (priority != null) {
            incident.setPriority(priority);
        }
        return incidentRepository.save(incident);
    }

    public List<Incident> getStudentIncidents(Long studentId) {
        return incidentRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    public List<Incident> getFacultyIncidents(String facultyName) {
        return incidentRepository.findByAssignedFacultyContainingIgnoreCase(facultyName);
    }

    public void deleteIncident(Long id) {
        Incident incident = getIncidentById(id);
        incidentRepository.delete(incident);
    }

    public Map<String, Object> getIncidentStats() {
        Map<String, Object> stats = new HashMap<>();
        long total = incidentRepository.count();
        long reported = incidentRepository.countByStatus(IncidentStatus.REPORTED);
        long investigating = incidentRepository.countByStatus(IncidentStatus.UNDER_INVESTIGATION);
        long resolved = incidentRepository.countByStatus(IncidentStatus.RESOLVED);
        long critical = incidentRepository.countByPriority(IncidentPriority.CRITICAL);

        stats.put("totalIncidents", total);
        stats.put("reportedCount", reported);
        stats.put("investigatingCount", investigating);
        stats.put("resolvedCount", resolved);
        stats.put("criticalCount", critical);
        stats.put("resolutionRate", total > 0 ? Math.round(((double) resolved / total) * 100) : 0);

        Map<String, Long> categoryBreakdown = new HashMap<>();
        for (IncidentCategory cat : IncidentCategory.values()) {
            long count = incidentRepository.countByCategory(cat);
            if (count > 0) {
                categoryBreakdown.put(cat.name(), count);
            }
        }
        stats.put("categories", categoryBreakdown);

        return stats;
    }
}
