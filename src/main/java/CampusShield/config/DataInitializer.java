package CampusShield.config;

import CampusShield.model.*;
import CampusShield.repository.IncidentRepository;
import CampusShield.repository.StudentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner initDatabase(
            StudentRepository studentRepo,
            IncidentRepository incidentRepo) {
        return args -> {
            // Seed Students
            if (studentRepo.count() == 0) {
                logger.info("Initializing CampusShield students roster...");
                List<Student> sampleStudents = List.of(
                    new Student(null, "Aarav Sharma", "aarav.sharma@campusshield.edu", "B.Tech Computer Science"),
                    new Student(null, "Priya Patel", "priya.patel@campusshield.edu", "B.Tech Information Technology"),
                    new Student(null, "Rohan Verma", "rohan.verma@campusshield.edu", "B.Tech Cyber Security"),
                    new Student(null, "Ananya Iyer", "ananya.iyer@campusshield.edu", "B.Tech AI & Data Science"),
                    new Student(null, "Vikram Malhotra", "vikram.m@campusshield.edu", "B.Tech Mechanical Engineering"),
                    new Student(null, "Sneha Rao", "sneha.rao@campusshield.edu", "B.Tech Electronics & Comm."),
                    new Student(null, "Kabir Mehta", "kabir.mehta@campusshield.edu", "Master of Computer Applications"),
                    new Student(null, "Diya Mukherjee", "diya.m@campusshield.edu", "B.Tech Cloud Computing")
                );
                studentRepo.saveAll(sampleStudents);
            }

            // Seed Safety Incidents & Complaints
            if (incidentRepo.count() == 0) {
                logger.info("Initializing CampusShield Incident & Safety records...");

                Incident inc1 = new Incident(
                        "Hostel C Corridor Verbal Intimidation",
                        "Group of senior students confronting 1st year students after 10 PM near block 4 stairs.",
                        IncidentCategory.RAGGING,
                        IncidentPriority.CRITICAL,
                        "Boys Hostel C, 2nd Floor Corridor",
                        true,
                        null,
                        "Anonymous Student",
                        "protected@campusshield.internal"
                );
                inc1.setStatus(IncidentStatus.UNDER_INVESTIGATION);
                inc1.setAssignedFaculty("Prof. Dr. R. K. Sharma (Anti-Ragging Squad)");
                inc1.setResolutionRemarks("CCTV footage pulled from corridor camera 4B. Committee scheduled hearing on Monday.");

                Incident inc2 = new Incident(
                        "Exposed High Voltage Wiring in Physics Lab 2",
                        "Live wires dangling from circuit distribution board near workbench 5. Extreme shock hazard during lab hours.",
                        IncidentCategory.SAFETY_HAZARD,
                        IncidentPriority.HIGH,
                        "Science Block, Physics Lab 2",
                        false,
                        1L,
                        "Aarav Sharma",
                        "aarav.sharma@campusshield.edu"
                );
                inc2.setStatus(IncidentStatus.RESOLVED);
                inc2.setAssignedFaculty("Er. Verma (Campus Maintenance Lead)");
                inc2.setResolutionRemarks("Electrician replaced entire MCB distribution box and enclosed wires in insulated conduits.");
                inc2.setResolvedAt(LocalDateTime.now().minusDays(1));

                Incident inc3 = new Incident(
                        "Vandalized Emergency Fire Extinguisher",
                        "Fire extinguisher pin removed and nozzle damaged near computer science seminar hall.",
                        IncidentCategory.PROPERTY_DAMAGE,
                        IncidentPriority.MEDIUM,
                        "Academic Block B, 3rd Floor Seminar Hall",
                        false,
                        2L,
                        "Priya Patel",
                        "priya.patel@campusshield.edu"
                );
                inc3.setStatus(IncidentStatus.UNDER_INVESTIGATION);
                inc3.setAssignedFaculty("Mr. Sandeep (Safety Officer)");

                Incident inc4 = new Incident(
                        "Cyber Harassment on College Discord/WhatsApp Group",
                        "Anonymous accounts posting derogatory comments and doctored pictures targeting female students.",
                        IncidentCategory.HARASSMENT,
                        IncidentPriority.CRITICAL,
                        "Digital Space / Campus Network",
                        true,
                        null,
                        "Anonymous Student",
                        "protected@campusshield.internal"
                );
                inc4.setStatus(IncidentStatus.REPORTED);

                Incident inc5 = new Incident(
                        "Unidentified Persons Loitering near Library Parking",
                        "Two individuals without college ID badges loitering near two-wheeler parking lot after sunset.",
                        IncidentCategory.SUSPICIOUS_ACTIVITY,
                        IncidentPriority.MEDIUM,
                        "Central Library South Gate Parking",
                        false,
                        3L,
                        "Rohan Verma",
                        "rohan.verma@campusshield.edu"
                );
                inc5.setStatus(IncidentStatus.RESOLVED);
                inc5.setAssignedFaculty("Capt. Devraj (Head of Security)");
                inc5.setResolutionRemarks("Security guards increased evening patrol frequency and checked gate guest registers.");
                inc5.setResolvedAt(LocalDateTime.now().minusHours(5));

                incidentRepo.saveAll(List.of(inc1, inc2, inc3, inc4, inc5));
                logger.info("Successfully seeded 5 initial campus safety incidents into CampusShield.");
            }
        };
    }
}
