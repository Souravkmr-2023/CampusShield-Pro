package CampusShield.repository;

import CampusShield.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Page<Student> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Student> findByEmailContainingIgnoreCase(String email, Pageable pageable);

    Page<Student> findByCourseContainingIgnoreCase(String course, Pageable pageable);
}
