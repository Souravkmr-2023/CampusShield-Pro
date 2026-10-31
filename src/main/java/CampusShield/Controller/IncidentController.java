package CampusShield.Controller;

import CampusShield.model.*;
import CampusShield.service.IncidentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/incidents")
@Tag(name = "Campus Incidents & Safety", description = "Safety complaint reporting, investigation, and lifecycle tracking")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @Operation(summary = "Get All Incidents (Paginated)", description = "Fetch all campus safety incidents with pagination and sorting")
    @GetMapping
    public Page<Incident> getAllIncidents(@ParameterObject Pageable pageable) {
        return incidentService.getAllIncidents(pageable);
    }

    @Operation(summary = "Get All Incidents (List)", description = "Fetch all campus safety incidents as complete list")
    @GetMapping("/all")
    public List<Incident> getAllIncidentsList() {
        return incidentService.getAllIncidentsList();
    }

    @Operation(summary = "Get Incident By ID")
    @GetMapping("/{id}")
    public Incident getIncidentById(@PathVariable Long id) {
        return incidentService.getIncidentById(id);
    }

    @Operation(summary = "Report Safety Incident", description = "Submit a campus complaint (Anti-ragging, hazard, property damage, etc.)")
    @PostMapping
    public ResponseEntity<Incident> reportIncident(@Valid @RequestBody Incident incident) {
        Incident created = incidentService.reportIncident(incident);
        return ResponseEntity.ok(created);
    }

    public record StatusUpdateRequest(
            IncidentStatus status,
            String remarks,
            String faculty
    ) {}

    @Operation(summary = "Update Incident Status", description = "Faculty/Admin update status and resolution remarks")
    @PutMapping("/{id}/status")
    public ResponseEntity<Incident> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        Incident updated = incidentService.updateStatus(id, request.status(), request.remarks(), request.faculty());
        return ResponseEntity.ok(updated);
    }

    public record AssignRequest(
            String faculty,
            IncidentPriority priority
    ) {}

    @Operation(summary = "Assign Incident to Faculty", description = "Admin assigns an incident to faculty committee")
    @PutMapping("/{id}/assign")
    public ResponseEntity<Incident> assignFaculty(
            @PathVariable Long id,
            @RequestBody AssignRequest request) {
        Incident updated = incidentService.assignFaculty(id, request.faculty(), request.priority());
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Get Student Incident History")
    @GetMapping("/student/{studentId}")
    public List<Incident> getStudentIncidents(@PathVariable Long studentId) {
        return incidentService.getStudentIncidents(studentId);
    }

    @Operation(summary = "Get Faculty Assigned Incidents")
    @GetMapping("/faculty")
    public List<Incident> getFacultyIncidents(@RequestParam String name) {
        return incidentService.getFacultyIncidents(name);
    }

    @Operation(summary = "Get Incident Analytics & Stats")
    @GetMapping("/stats")
    public Map<String, Object> getIncidentStats() {
        return incidentService.getIncidentStats();
    }

    @Operation(summary = "Delete Incident Record")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.ok(Map.of("message", "Incident #" + id + " deleted successfully"));
    }
}
