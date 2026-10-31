package CampusShield.service;

import CampusShield.exception.StudentNotFoundException;
import CampusShield.model.Student;
import CampusShield.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    public Page<Student> getAllStudents(Pageable pageable) {
    return studentRepository.findAll(pageable);
}
   public Student getStudentById(Long id) {
    return studentRepository.findById(id)
            .orElseThrow(() -> new StudentNotFoundException(
                    "Student with ID " + id + " not found"
            ));
}
   public Page<Student> searchStudentsByName(String name, Pageable pageable) {
    return studentRepository.findByNameContainingIgnoreCase(name, pageable);
} 
   public Page<Student> searchStudentsByEmail(String email, Pageable pageable) {
    return studentRepository.findByEmailContainingIgnoreCase(email, pageable);
}
   public Page<Student> searchStudentsByCourse(String course, Pageable pageable) {
    return studentRepository.findByCourseContainingIgnoreCase(course, pageable);
}
   public Page<Student> unifiedSearch(
        String name,
        String email,
        String course,
        Pageable pageable) {

    if (name != null && !name.isBlank()) {
        return studentRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    if (email != null && !email.isBlank()) {
        return studentRepository.findByEmailContainingIgnoreCase(email, pageable);
    }

    if (course != null && !course.isBlank()) {
        return studentRepository.findByCourseContainingIgnoreCase(course, pageable);
    }

    return studentRepository.findAll(pageable);
}
    public Student addStudent(Student student) {
    return studentRepository.save(student);
}

    public Student updateStudent(Long id, Student student) {
    Student existingStudent = studentRepository.findById(id)
            .orElseThrow(() -> new StudentNotFoundException(
                    "Student with ID " + id + " not found"
            ));

    existingStudent.setName(student.getName());
    existingStudent.setEmail(student.getEmail());
    existingStudent.setCourse(student.getCourse());

    return studentRepository.save(existingStudent);
}
public void deleteStudent(Long id) {
    Student existingStudent = studentRepository.findById(id)
            .orElseThrow(() -> new StudentNotFoundException(
                    "Student with ID " + id + " not found"
            ));

    studentRepository.delete(existingStudent);
}
}