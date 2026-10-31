package CampusShield.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Admin security & session management")
public class AuthController {

    // Default admin credentials for campus security operations
    private static final String ADMIN_USER = "admin";
    private static final String ADMIN_PASS = "admin123";

    public record LoginRequest(
            @NotBlank(message = "Username is required") String username,
            @NotBlank(message = "Password is required") String password
    ) {}

    public record LoginResponse(
            boolean success,
            String token,
            String username,
            String fullName,
            String role,
            String message
    ) {}

    @Operation(summary = "Admin Login", description = "Authenticate administrator with credentials")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.username() != null && request.password() != null &&
                (request.username().trim().equalsIgnoreCase(ADMIN_USER) || request.username().trim().equalsIgnoreCase("admin@campusshield.edu")) &&
                request.password().trim().equals(ADMIN_PASS)) {

            String token = "cs_auth_" + UUID.randomUUID();
            return ResponseEntity.ok(new LoginResponse(
                    true,
                    token,
                    "admin",
                    "Campus Security Administrator",
                    "SUPER_ADMIN",
                    "Authentication successful"
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "success", false,
                "message", "Invalid username or password. Default is admin / admin123"
        ));
    }

    @Operation(summary = "Verify Session", description = "Validate current admin session token")
    @GetMapping("/verify")
    public ResponseEntity<?> verifySession(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer cs_auth_")) {
            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "role", "SUPER_ADMIN",
                    "username", "admin"
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "valid", false,
                "message", "Session expired or invalid"
        ));
    }
}
