
package CampusShield.Controller;

import CampusShield.model.Student;
import CampusShield.service.StudentService;
import CampusShield.exception.StudentNotFoundException;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;


import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StudentController.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper =
            new com.fasterxml.jackson.databind.ObjectMapper();

    @MockitoBean
    private StudentService studentService;

    @Test
    void getAllStudents_shouldReturn200() throws Exception {
        Student student = new Student();
        student.setId(1L);
        student.setName("Rahul");
        student.setEmail("rahul.test@example.com");
        student.setCourse("B.Tech CSE");

        Page<Student> studentPage = new PageImpl<>(
                List.of(student), PageRequest.of(0, 10), 1);

        when(studentService.getAllStudents(any())).thenReturn(studentPage);

        mockMvc.perform(get("/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Rahul"))
                .andExpect(jsonPath("$.content[0].email")
                        .value("rahul.test@example.com"));
    }

    @Test
    void addStudent_withInvalidData_shouldReturn400() throws Exception {
        Student student = new Student();
        student.setName("");
        student.setEmail("invalid-email");
        student.setCourse("");

        mockMvc.perform(post("/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(student)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getStudentById_whenStudentDoesNotExist_shouldReturn404()
            throws Exception {

        when(studentService.getStudentById(999999L))
        .thenThrow(new StudentNotFoundException(
                "Student with ID 999999 not found"));

        mockMvc.perform(get("/students/999999"))
                .andExpect(status().isNotFound());
    }
}
