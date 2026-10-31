
package CampusShield.Controller;

import jakarta.validation.Valid;
import CampusShield.model.Student;
import CampusShield.service.StudentService;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springdoc.core.annotations.ParameterObject;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Get all students with pagination and sorting
    @Operation(
        summary = "Get all students",
        description = "Get all students with pagination and sorting"
    )
    @GetMapping
    public Page<Student> getAllStudents(
            @ParameterObject Pageable pageable) {
        return studentService.getAllStudents(pageable);
    }

    // Search students by name
    @Operation(
        summary = "Search students by name",
        description = "Search students by a partial or complete name. Supports pagination and sorting."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Students retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid search or pagination parameters"),
        @ApiResponse(responseCode = "500", description = "Unexpected server error")
    })
    @GetMapping("/search")
    public Page<Student> searchStudents(
            @Parameter(description = "Name or part of the name to search", example = "Am", required = true)
            @RequestParam String name,
            @ParameterObject Pageable pageable) {
        return studentService.searchStudentsByName(name, pageable);
    }

    // Search students by email
    @Operation(
        summary = "Search students by email",
        description = "Search students using a partial or complete email address. Supports pagination and sorting."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Students retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid search or pagination parameters"),
        @ApiResponse(responseCode = "500", description = "Unexpected server error")
    })
    @GetMapping("/search/email")
    public Page<Student> searchStudentsByEmail(
            @Parameter(description = "Email or part of the email to search", example = "aman", required = true)
            @RequestParam String email,
            @ParameterObject Pageable pageable) {
        return studentService.searchStudentsByEmail(email, pageable);
    }

    // Search students by course
    @Operation(
        summary = "Search students by course",
        description = "Search students using a partial or complete course name. Supports pagination and sorting."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Students retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid search or pagination parameters"),
        @ApiResponse(responseCode = "500", description = "Unexpected server error")
    })
    @GetMapping("/search/course")
    public Page<Student> searchStudentsByCourse(
            @Parameter(description = "Course name or part of the course name", example = "B.Tech CSE", required = true)
            @RequestParam String course,
            @ParameterObject Pageable pageable) {
        return studentService.searchStudentsByCourse(course, pageable);
    }

    // Unified student search
    @Operation(
        summary = "Unified student search",
        description = "Search students by name, email, or course. If multiple search fields are provided, name takes priority, followed by email, then course. If no field is provided, all students are returned."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Students retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid search or pagination parameters"),
        @ApiResponse(responseCode = "500", description = "Unexpected server error")
    })
    @GetMapping("/unified-search")
    public Page<Student> unifiedSearch(
            @Parameter(description = "Name or partial name", example = "Am")
            @RequestParam(required = false) String name,

            @Parameter(description = "Email or partial email", example = "aman")
            @RequestParam(required = false) String email,

            @Parameter(description = "Course or partial course name", example = "CSE")
            @RequestParam(required = false) String course,

            @ParameterObject Pageable pageable) {
        return studentService.unifiedSearch(name, email, course, pageable);
    }

    // Get student by ID
    @Operation(
        summary = "Get student by ID",
        description = "Get a single student using the student's ID"
    )
    @GetMapping("/{id}")
    public Student getStudentById(
            @Parameter(description = "Student ID", example = "1")
            @PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    // Add student
    @Operation(
        summary = "Add a new student",
        description = "Create a new student. Email must be unique."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Student created successfully"),
        @ApiResponse(responseCode = "400", description = "Validation failed"),
        @ApiResponse(responseCode = "409", description = "Email already exists"),
        @ApiResponse(responseCode = "500", description = "Unexpected server error")
    })
    @PostMapping
    public Student addStudent(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Student details",
                required = true
            )
            @Valid @RequestBody Student student) {
        return studentService.addStudent(student);
    }

    // Update student
    @Operation(
        summary = "Update a student",
        description = "Update an existing student using the student's ID"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Student updated successfully"),
        @ApiResponse(responseCode = "400", description = "Validation failed"),
        @ApiResponse(responseCode = "404", description = "Student not found"),
        @ApiResponse(responseCode = "409", description = "Email already exists"),
        @ApiResponse(responseCode = "500", description = "Unexpected server error")
    })
    @PutMapping("/{id}")
    public Student updateStudent(
            @Parameter(description = "Student ID", example = "1")
            @PathVariable Long id,

            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Updated student details",
                required = true
            )
            @Valid @RequestBody Student student) {
        return studentService.updateStudent(id, student);
    }

    // Delete student
    @Operation(
        summary = "Delete a student",
        description = "Delete an existing student using the student's ID"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Student deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Student not found"),
        @ApiResponse(responseCode = "500", description = "Unexpected server error")
    })
    @DeleteMapping("/{id}")
    public String deleteStudent(
            @Parameter(description = "Student ID", example = "1")
            @PathVariable Long id) {
        studentService.deleteStudent(id);
        return "Student deleted successfully";
    }
}
