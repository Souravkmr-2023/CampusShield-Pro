package CampusShield.model;

public enum IncidentCategory {
    RAGGING("Anti-Ragging"),
    HARASSMENT("Harassment & Bullying"),
    SAFETY_HAZARD("Lab & Campus Hazard"),
    PROPERTY_DAMAGE("Campus Property Damage"),
    SUSPICIOUS_ACTIVITY("Suspicious Activity"),
    MEDICAL_EMERGENCY("Medical Emergency"),
    OTHER("Other Concern");

    private final String displayName;

    IncidentCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
