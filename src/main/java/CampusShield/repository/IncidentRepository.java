package CampusShield.repository;

import CampusShield.model.Incident;
import CampusShield.model.IncidentCategory;
import CampusShield.model.IncidentPriority;
import CampusShield.model.IncidentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

    Page<Incident> findByStatus(IncidentStatus status, Pageable pageable);

    Page<Incident> findByCategory(IncidentCategory category, Pageable pageable);

    Page<Incident> findByPriority(IncidentPriority priority, Pageable pageable);

    List<Incident> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<Incident> findByAssignedFacultyContainingIgnoreCase(String facultyName);

    long countByStatus(IncidentStatus status);

    long countByCategory(IncidentCategory category);

    long countByPriority(IncidentPriority priority);
}
