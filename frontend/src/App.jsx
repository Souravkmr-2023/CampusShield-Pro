import { useEffect, useState, useMemo } from "react";
import "./App.css";

const CATEGORIES = [
  { id: "RAGGING", label: "Anti-Ragging", class: "ragging", icon: "🚫" },
  { id: "HARASSMENT", label: "Harassment & Bullying", class: "harassment", icon: "⚠️" },
  { id: "SAFETY_HAZARD", label: "Lab & Campus Hazard", class: "hazard", icon: "⚡" },
  { id: "PROPERTY_DAMAGE", label: "Property Damage", class: "damage", icon: "🔨" },
  { id: "SUSPICIOUS_ACTIVITY", label: "Suspicious Activity", class: "suspicious", icon: "👁️" },
  { id: "MEDICAL_EMERGENCY", label: "Medical Emergency", class: "hazard", icon: "🚑" },
  { id: "OTHER", label: "Other Safety Concern", class: "suspicious", icon: "📝" },
];

const FACULTY_LIST = [
  "Prof. Dr. R. K. Sharma (Anti-Ragging Squad)",
  "Prof. Dr. Anjali Sen (Women's Safety Committee)",
  "Er. Verma (Campus Maintenance & Labs)",
  "Capt. Devraj (Head of Security)",
  "Dr. P. K. Mishra (Student Welfare Dean)"
];

function App() {
  // Global Active Role: 'STUDENT' | 'FACULTY' | 'ADMIN'
  const [activeRole, setActiveRole] = useState("ADMIN");

  // Navigation Sub-tab inside Admin
  const [adminTab, setAdminTab] = useState("incidents"); // 'incidents' | 'students' | 'badges'

  // Data States
  const [incidents, setIncidents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);

  // Modals
  const [showReportModal, setShowReportModal] = useState(false);
  const [showInvestigateModal, setShowInvestigateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStudentAddModal, setShowStudentAddModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  // Active items for modals
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Incident Form State (Student Portal)
  const [reportForm, setReportForm] = useState({
    title: "",
    description: "",
    category: "RAGGING",
    priority: "HIGH",
    location: "",
    anonymous: false,
    reporterName: "Rahul Sharma",
    reporterEmail: "rahul.sharma@campusshield.edu",
  });

  // Investigation Form State (Faculty Portal)
  const [investigateForm, setInvestigateForm] = useState({
    status: "UNDER_INVESTIGATION",
    remarks: "",
    faculty: FACULTY_LIST[0],
  });

  // Assign Form State (Admin Portal)
  const [assignForm, setAssignForm] = useState({
    faculty: FACULTY_LIST[0],
    priority: "HIGH",
  });

  // Student Add Form
  const [newStudentForm, setNewStudentForm] = useState({
    name: "",
    email: "",
    course: "B.Tech Computer Science"
  });

  // Search & Filters
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Fetch all incidents
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/incidents/all");
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
        setBackendOnline(true);
      }
    } catch (e) {
      console.warn("Backend not yet recompiled for /incidents, using local fallback seed data");
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await fetch("/students?page=0&size=100");
      if (res.ok) {
        const data = await res.json();
        setStudents(Array.isArray(data) ? data : (data.content || []));
      }
    } catch (e) {
      // fallback
    }
  };

  useEffect(() => {
    fetchIncidents();
    fetchStudents();
  }, []);

  // Filtered Incidents
  const filteredIncidents = useMemo(() => {
    let result = [...incidents];

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      result = result.filter(
        (i) =>
          (i.title && i.title.toLowerCase().includes(q)) ||
          (i.description && i.description.toLowerCase().includes(q)) ||
          (i.location && i.location.toLowerCase().includes(q)) ||
          (i.assignedFaculty && i.assignedFaculty.toLowerCase().includes(q))
      );
    }

    if (categoryFilter !== "ALL") {
      result = result.filter((i) => i.category === categoryFilter);
    }

    if (statusFilter !== "ALL") {
      result = result.filter((i) => i.status === statusFilter);
    }

    return result;
  }, [incidents, searchFilter, categoryFilter, statusFilter]);

  // Analytics
  const stats = useMemo(() => {
    const total = incidents.length;
    const reported = incidents.filter((i) => i.status === "REPORTED").length;
    const investigating = incidents.filter((i) => i.status === "UNDER_INVESTIGATION").length;
    const resolved = incidents.filter((i) => i.status === "RESOLVED").length;
    const critical = incidents.filter((i) => i.priority === "CRITICAL").length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    const catCounts = {};
    incidents.forEach((i) => {
      catCounts[i.category] = (catCounts[i.category] || 0) + 1;
    });

    return { total, reported, investigating, resolved, critical, resolutionRate, catCounts };
  }, [incidents]);

  // Handle Submit Incident (Student Portal)
  const handleReportIncident = async (e) => {
    e.preventDefault();
    if (!reportForm.title.trim() || !reportForm.description.trim() || !reportForm.location.trim()) {
      addToast("error", "Validation Error", "Please fill in title, description, and location.");
      return;
    }

    const newIncident = {
      id: Date.now(),
      title: reportForm.title.trim(),
      description: reportForm.description.trim(),
      category: reportForm.category,
      priority: reportForm.priority,
      location: reportForm.location.trim(),
      anonymous: reportForm.anonymous,
      reporterName: reportForm.anonymous ? "Anonymous Student" : reportForm.reporterName,
      reporterEmail: reportForm.anonymous ? "protected@campusshield.internal" : reportForm.reporterEmail,
      status: "REPORTED",
      createdAt: new Date().toISOString(),
      resolutionRemarks: null,
      assignedFaculty: null,
    };

    try {
      const res = await fetch("/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIncident),
      });
      if (res.ok) {
        const saved = await res.json();
        setIncidents((prev) => [saved, ...prev]);
      } else {
        setIncidents((prev) => [newIncident, ...prev]);
      }
    } catch (err) {
      setIncidents((prev) => [newIncident, ...prev]);
    }

    setShowReportModal(false);
    setReportForm({
      title: "",
      description: "",
      category: "RAGGING",
      priority: "HIGH",
      location: "",
      anonymous: false,
      reporterName: "Rahul Sharma",
      reporterEmail: "rahul.sharma@campusshield.edu",
    });
    addToast("success", "Incident Registered", "Campus Security & Committee have been notified.");
  };

  // Handle Faculty Status Update
  const handleUpdateInvestigation = async (e) => {
    e.preventDefault();
    if (!selectedIncident) return;

    const updatedIncident = {
      ...selectedIncident,
      status: investigateForm.status,
      resolutionRemarks: investigateForm.remarks.trim() || selectedIncident.resolutionRemarks,
      assignedFaculty: investigateForm.faculty || selectedIncident.assignedFaculty,
      resolvedAt: investigateForm.status === "RESOLVED" ? new Date().toISOString() : null,
    };

    try {
      await fetch(`/incidents/${selectedIncident.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: investigateForm.status,
          remarks: investigateForm.remarks.trim(),
          faculty: investigateForm.faculty,
        }),
      });
    } catch (err) {
      // offline fallback
    }

    setIncidents((prev) => prev.map((i) => (i.id === selectedIncident.id ? updatedIncident : i)));
    setShowInvestigateModal(false);
    addToast("success", "Investigation Updated", `Incident #${selectedIncident.id} status changed to ${investigateForm.status}`);
  };

  // Handle Admin Assignment
  const handleAssignFaculty = async (e) => {
    e.preventDefault();
    if (!selectedIncident) return;

    const updatedIncident = {
      ...selectedIncident,
      assignedFaculty: assignForm.faculty,
      priority: assignForm.priority,
      status: selectedIncident.status === "REPORTED" ? "UNDER_INVESTIGATION" : selectedIncident.status,
    };

    try {
      await fetch(`/incidents/${selectedIncident.id}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faculty: assignForm.faculty,
          priority: assignForm.priority,
        }),
      });
    } catch (err) {
      // offline fallback
    }

    setIncidents((prev) => prev.map((i) => (i.id === selectedIncident.id ? updatedIncident : i)));
    setShowAssignModal(false);
    addToast("success", "Faculty Assigned", `Assigned to ${assignForm.faculty}`);
  };

  // Export Incidents CSV
  const handleExportIncidentsCSV = () => {
    if (incidents.length === 0) return;
    const headers = ["ID", "Category", "Priority", "Status", "Title", "Location", "Reporter", "Assigned Faculty", "Remarks"];
    const rows = incidents.map((i) => [
      i.id,
      i.category,
      i.priority,
      i.status,
      `"${i.title || ""}"`,
      `"${i.location || ""}"`,
      `"${i.anonymous ? "Anonymous" : i.reporterName || ""}"`,
      `"${i.assignedFaculty || "Unassigned"}"`,
      `"${i.resolutionRemarks || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `campusshield_incident_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("success", "Report Exported", "Incident log downloaded as CSV.");
  };

  // Add Student Handler (Supporting Module)
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentForm.name.trim() || !newStudentForm.email.trim()) return;

    try {
      const res = await fetch("/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudentForm),
      });
      if (res.ok) {
        await fetchStudents();
        setShowStudentAddModal(false);
        setNewStudentForm({ name: "", email: "", course: "B.Tech Computer Science" });
        addToast("success", "Student Registered", `Enrolled ${newStudentForm.name}`);
      }
    } catch (err) {
      addToast("error", "Error", "Failed to add student.");
    }
  };

  return (
    <div>
      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <div className="toast-content">
              <h4>{toast.title}</h4>
              <p>{toast.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TOP ROLE SWITCHER BAR (Key for B.Tech Viva / Interview Demonstrations) */}
      <header className="role-bar">
        <div className="role-bar-left">
          <strong>🛡️ CampusShield Pro</strong>
          <span className="role-badge-tag">Incident & Safety Management</span>
        </div>

        <div className="role-selector">
          <button
            className={`role-btn ${activeRole === "STUDENT" ? "active" : ""}`}
            onClick={() => setActiveRole("STUDENT")}
          >
            <span>🎓 Student Portal</span>
          </button>
          <button
            className={`role-btn ${activeRole === "FACULTY" ? "active" : ""}`}
            onClick={() => setActiveRole("FACULTY")}
          >
            <span>👨‍🏫 Faculty Committee</span>
          </button>
          <button
            className={`role-btn ${activeRole === "ADMIN" ? "active" : ""}`}
            onClick={() => setActiveRole("ADMIN")}
          >
            <span>🏛️ Admin Command Center</span>
          </button>
        </div>
      </header>

      {/* ================= VIEW 1: STUDENT PORTAL ================= */}
      {activeRole === "STUDENT" && (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
          {/* Emergency SOS Banner */}
          <div className="emergency-banner">
            <div className="emergency-left">
              <span className="emergency-icon">🚨</span>
              <div>
                <h4>Campus Emergency & Anti-Ragging Hotline</h4>
                <p>24x7 Confidential Student Safety, Harassment, and Medical Support</p>
              </div>
            </div>
            <div className="emergency-numbers">
              <span className="emergency-tag">Anti-Ragging: 1800-180-5522</span>
              <span className="emergency-tag">Campus Police: Ext 100</span>
              <span className="emergency-tag">Ambulance: Ext 108</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>Student Safety Portal</h2>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Report incidents confidentially. Track investigation status and committee remarks.
              </p>
            </div>
            <button
              className="btn btn-danger-solid"
              onClick={() => setShowReportModal(true)}
            >
              <span>🚨</span> Report Safety Incident
            </button>
          </div>

          {/* Quick Category Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "30px" }}>
            {CATEGORIES.slice(0, 5).map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setReportForm((prev) => ({ ...prev, category: cat.id }));
                  setShowReportModal(true);
                }}
                style={{
                  background: "white",
                  border: "1px solid var(--border-card)",
                  borderRadius: "10px",
                  padding: "16px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{cat.icon}</div>
                <strong style={{ fontSize: "13px", color: "#1e293b", display: "block" }}>{cat.label}</strong>
                <span style={{ fontSize: "11px", color: "var(--primary)", marginTop: "4px", display: "block" }}>
                  Report Issue →
                </span>
              </div>
            ))}
          </div>

          {/* Student's Reported Incidents List */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <h3>Campus Incident Feed & Investigation Tracking</h3>
                <p>Live status updates from Anti-Ragging Committee and Campus Security</p>
              </div>
            </div>

            <div className="incident-cards-grid">
              {incidents.map((incident) => (
                <div key={incident.id} className="incident-card">
                  <div>
                    <div className="incident-card-header">
                      <span className={`badge-category ${CATEGORIES.find((c) => c.id === incident.category)?.class || "ragging"}`}>
                        {CATEGORIES.find((c) => c.id === incident.category)?.label || incident.category}
                      </span>
                      <span className={`badge-priority ${incident.priority?.toLowerCase()}`}>
                        {incident.priority}
                      </span>
                    </div>

                    <h4 className="incident-card-title">{incident.title}</h4>
                    <p className="incident-card-desc">{incident.description}</p>
                  </div>

                  <div>
                    <div className="incident-card-meta">
                      <p><strong>📍 Location:</strong> {incident.location}</p>
                      <p><strong>👤 Reported by:</strong> {incident.anonymous ? "Anonymous Student" : incident.reporterName}</p>
                      <p><strong>👨‍🏫 Assigned:</strong> {incident.assignedFaculty || "Pending Assignment"}</p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className={`badge-status ${incident.status?.toLowerCase().replace("_", "")}`}>
                        ● {incident.status?.replace("_", " ")}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--text-light)" }}>
                        #{incident.id}
                      </span>
                    </div>

                    {incident.resolutionRemarks && (
                      <div className="incident-remarks-box">
                        <strong>Official Findings / Action:</strong>
                        <p>{incident.resolutionRemarks}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: FACULTY PORTAL ================= */}
      {activeRole === "FACULTY" && (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>Faculty Safety Committee Dashboard</h2>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Investigate student safety complaints, record findings, and update case status.
              </p>
            </div>
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", color: "#1d4ed8" }}>
              Logged in as: <strong>Prof. Dr. R. K. Sharma (Anti-Ragging Squad)</strong>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-title">ASSIGNED CASES</div>
              <div className="stat-number">{incidents.length}</div>
              <div className="stat-meta">Total assigned complaints</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">UNDER INVESTIGATION</div>
              <div className="stat-number" style={{ color: "#2563eb" }}>{stats.investigating}</div>
              <div className="stat-meta">Active hearings/inquiries</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">RESOLVED CASES</div>
              <div className="stat-number" style={{ color: "#059669" }}>{stats.resolved}</div>
              <div className="stat-meta">Completed and closed</div>
            </div>
          </div>

          {/* Faculty Investigation Table */}
          <div className="table-panel">
            <div className="card-header" style={{ padding: "20px 24px" }}>
              <div className="card-title">
                <h3>Incident Investigation Queue</h3>
                <p>Click "Investigate" to record resolution remarks and update complaint status</p>
              </div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Incident Title & Location</th>
                    <th>Reporter</th>
                    <th>Current Status</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident) => (
                    <tr key={incident.id}>
                      <td><span className="id-badge">#{incident.id}</span></td>
                      <td>
                        <span className={`badge-category ${CATEGORIES.find((c) => c.id === incident.category)?.class || "ragging"}`}>
                          {CATEGORIES.find((c) => c.id === incident.category)?.label || incident.category}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-priority ${incident.priority?.toLowerCase()}`}>
                          {incident.priority}
                        </span>
                      </td>
                      <td>
                        <strong>{incident.title}</strong>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>📍 {incident.location}</div>
                      </td>
                      <td>
                        {incident.anonymous ? (
                          <span className="anonymous-pill">🔒 Anonymous</span>
                        ) : (
                          <span>{incident.reporterName}</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge-status ${incident.status?.toLowerCase().replace("_", "")}`}>
                          ● {incident.status?.replace("_", " ")}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setSelectedIncident(incident);
                            setInvestigateForm({
                              status: incident.status,
                              remarks: incident.resolutionRemarks || "",
                              faculty: incident.assignedFaculty || FACULTY_LIST[0],
                            });
                            setShowInvestigateModal(true);
                          }}
                        >
                          🔍 Investigate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 3: ADMIN COMMAND CENTER ================= */}
      {activeRole === "ADMIN" && (
        <div className="app-shell">
          <aside className="sidebar">
            <div className="brand">
              <div className="brand-icon">🛡️</div>
              <div className="brand-text">
                <h2>CampusShield</h2>
                <span className="brand-badge">Admin Center</span>
              </div>
            </div>

            <nav className="sidebar-nav">
              <div className="nav-section-title">Safety Operations</div>

              <button
                className={`nav-item ${adminTab === "incidents" ? "active" : ""}`}
                onClick={() => setAdminTab("incidents")}
              >
                <span className="nav-icon">🚨</span>
                <span>Incident Command</span>
                <span className="nav-counter">{incidents.length}</span>
              </button>

              <button
                className={`nav-item ${adminTab === "students" ? "active" : ""}`}
                onClick={() => setAdminTab("students")}
              >
                <span className="nav-icon">🎓</span>
                <span>Campus Roster</span>
                <span className="nav-counter">{students.length}</span>
              </button>

              <button
                className={`nav-item ${adminTab === "badges" ? "active" : ""}`}
                onClick={() => setAdminTab("badges")}
              >
                <span className="nav-icon">🪪</span>
                <span>Security Gate Passes</span>
              </button>

              <div className="nav-section-title" style={{ marginTop: "24px" }}>System</div>
              
              <a
                href="/swagger-ui/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-item"
                style={{ textDecoration: "none" }}
              >
                <span className="nav-icon">⚡</span>
                <span>Swagger API Docs</span>
              </a>
            </nav>

            <div className="sidebar-footer">
              <div className="admin-card">
                <div className="admin-meta">
                  <div className="admin-avatar">AD</div>
                  <div className="admin-info">
                    <h4>Campus Admin</h4>
                    <p>Security clearance: Level 5</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="main-content">
            <header className="topbar">
              <div className="topbar-left">
                <h1>Campus Safety & Incident Command Center</h1>
                <p>Enterprise incident triage, committee assignment, and safety analytics</p>
              </div>

              <div className="topbar-right">
                <div className="status-indicator">
                  <span className={`status-dot ${backendOnline ? "online" : "offline"}`} />
                  <span>{backendOnline ? "Backend Live (Port 8080)" : "Backend Offline"}</span>
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={handleExportIncidentsCSV}
                >
                  📥 Export Incidents CSV
                </button>

                <button
                  className="btn btn-danger-solid"
                  onClick={() => setShowReportModal(true)}
                >
                  <span>+</span> New Incident
                </button>
              </div>
            </header>

            {/* TAB: INCIDENT COMMAND */}
            {adminTab === "incidents" && (
              <div>
                {/* Critical Alert Warning if critical incidents exist */}
                {stats.critical > 0 && (
                  <div style={{ background: "#fef2f2", borderLeft: "4px solid #dc2626", padding: "14px 18px", borderRadius: "8px", marginBottom: "22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ color: "#991b1b" }}>⚠️ Priority Notice:</strong> {stats.critical} Critical safety incidents require immediate committee hearing.
                    </div>
                    <span className="badge-priority critical">CRITICAL</span>
                  </div>
                )}

                {/* KPI Metrics */}
                <section className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-title">TOTAL INCIDENTS</div>
                    <div className="stat-number">{stats.total}</div>
                    <div className="stat-meta">Reported campus safety logs</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-title">PENDING ACTION</div>
                    <div className="stat-number" style={{ color: "#d97706" }}>{stats.reported}</div>
                    <div className="stat-meta">Awaiting committee assignment</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-title">UNDER INQUIRY</div>
                    <div className="stat-number" style={{ color: "#2563eb" }}>{stats.investigating}</div>
                    <div className="stat-meta">Active hearings & patrols</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-title">RESOLUTION RATE</div>
                    <div className="stat-number" style={{ color: "#059669" }}>{stats.resolutionRate}%</div>
                    <div className="stat-meta">{stats.resolved} cases resolved & closed</div>
                  </div>
                </section>

                {/* Master Incident Table */}
                <div className="table-panel">
                  <div className="table-toolbar">
                    <div className="search-filter-group">
                      <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                          type="text"
                          className="search-input"
                          placeholder="Search incidents by title, location, or faculty..."
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                        />
                      </div>

                      <select
                        className="filter-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                      >
                        <option value="ALL">All Categories</option>
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>

                      <select
                        className="filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="REPORTED">Reported</option>
                        <option value="UNDER_INVESTIGATION">Under Investigation</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </div>

                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={fetchIncidents}
                    >
                      🔄 Refresh
                    </button>
                  </div>

                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Category</th>
                          <th>Priority</th>
                          <th>Title & Campus Location</th>
                          <th>Reporter</th>
                          <th>Assigned Committee</th>
                          <th>Status</th>
                          <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredIncidents.length === 0 ? (
                          <tr>
                            <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                              No matching incident reports found.
                            </td>
                          </tr>
                        ) : (
                          filteredIncidents.map((incident) => (
                            <tr key={incident.id}>
                              <td><span className="id-badge">#{incident.id}</span></td>
                              <td>
                                <span className={`badge-category ${CATEGORIES.find((c) => c.id === incident.category)?.class || "ragging"}`}>
                                  {CATEGORIES.find((c) => c.id === incident.category)?.label || incident.category}
                                </span>
                              </td>
                              <td>
                                <span className={`badge-priority ${incident.priority?.toLowerCase()}`}>
                                  {incident.priority}
                                </span>
                              </td>
                              <td>
                                <strong>{incident.title}</strong>
                                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>📍 {incident.location}</div>
                              </td>
                              <td>
                                {incident.anonymous ? (
                                  <span className="anonymous-pill">🔒 Anonymous</span>
                                ) : (
                                  <span>{incident.reporterName}</span>
                                )}
                              </td>
                              <td>
                                <span style={{ fontSize: "12px", color: incident.assignedFaculty ? "#0f172a" : "#dc2626" }}>
                                  {incident.assignedFaculty || "⚠️ Unassigned"}
                                </span>
                              </td>
                              <td>
                                <span className={`badge-status ${incident.status?.toLowerCase().replace("_", "")}`}>
                                  ● {incident.status?.replace("_", " ")}
                                </span>
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <div className="table-row-actions" style={{ justifyContent: "flex-end" }}>
                                  <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => {
                                      setSelectedIncident(incident);
                                      setAssignForm({
                                        faculty: incident.assignedFaculty || FACULTY_LIST[0],
                                        priority: incident.priority || "HIGH",
                                      });
                                      setShowAssignModal(true);
                                    }}
                                  >
                                    Assign
                                  </button>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => {
                                      setSelectedIncident(incident);
                                      setInvestigateForm({
                                        status: incident.status,
                                        remarks: incident.resolutionRemarks || "",
                                        faculty: incident.assignedFaculty || FACULTY_LIST[0],
                                      });
                                      setShowInvestigateModal(true);
                                    }}
                                  >
                                    Review
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CAMPUS ROSTER (STUDENTS) */}
            {adminTab === "students" && (
              <div className="table-panel">
                <div className="table-toolbar">
                  <div className="card-title">
                    <h3>Campus Student Directory & Access Clearances</h3>
                    <p>Supporting module: Student enrollment & academic records</p>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowStudentAddModal(true)}
                  >
                    + Enroll Student
                  </button>
                </div>

                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student Name</th>
                        <th>Email Address</th>
                        <th>Department</th>
                        <th>Clearance</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s.id}>
                          <td><span className="id-badge">#{s.id}</span></td>
                          <td><strong>{s.name}</strong></td>
                          <td>{s.email}</td>
                          <td><span className="badge-category damage">{s.course}</span></td>
                          <td><span className="badge-status resolved">● Cleared</span></td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setSelectedStudent(s);
                                setShowBadgeModal(true);
                              }}
                            >
                              🪪 ID Pass
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: BADGES */}
            {adminTab === "badges" && (
              <div className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
                <h3 style={{ marginBottom: "16px" }}>Digital Security Gate Pass Generator</h3>
                {students[0] && (
                  <div className="badge-preview-card">
                    <div className="badge-watermark">🛡️</div>
                    <div className="badge-top">
                      <div className="badge-institution">
                        <h4>CAMPUSSHIELD INSTITUTE</h4>
                        <span>Verified Student ID & Security Gate Pass</span>
                      </div>
                    </div>
                    <div className="badge-profile">
                      <div className="badge-photo">
                        {students[0].name.charAt(0)}
                      </div>
                      <div className="badge-details">
                        <h3>{students[0].name}</h3>
                        <p>ID: CS-{1000 + Number(students[0].id)}</p>
                        <p>{students[0].course}</p>
                        <span className="badge-clearance">● LEVEL 1 SECURITY CLEARANCE</span>
                      </div>
                    </div>
                    <button className="btn btn-primary" style={{ width: "100%", marginTop: "16px" }} onClick={() => window.print()}>
                      🖨️ Print Student Pass
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}

      {/* ================= MODAL: REPORT SAFETY INCIDENT ================= */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🚨 Report Campus Safety Incident</h3>
              <button className="modal-close" onClick={() => setShowReportModal(false)}>✕</button>
            </div>
            <form onSubmit={handleReportIncident}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Incident Category *</label>
                  <select
                    className="form-input"
                    value={reportForm.category}
                    onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Incident Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Brief description (e.g. Ragging in Hostel C staircase, Exposed wires in Lab 2)"
                    value={reportForm.title}
                    onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Campus Location *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Science Block, Physics Lab 2 or Boys Hostel 4"
                    value={reportForm.location}
                    onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Priority / Severity *</label>
                  <select
                    className="form-input"
                    value={reportForm.priority}
                    onChange={(e) => setReportForm({ ...reportForm, priority: e.target.value })}
                  >
                    <option value="LOW">Low - General observation</option>
                    <option value="MEDIUM">Medium - Needs maintenance/attention</option>
                    <option value="HIGH">High - Urgent safety issue</option>
                    <option value="CRITICAL">Critical - Severe hazard / Ragging emergency</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description of Incident *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Provide full details: what happened, persons involved, time, and immediate danger..."
                    value={reportForm.description}
                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  />
                </div>

                {/* Anonymous Reporting Toggle */}
                <div
                  className="anonymous-box"
                  onClick={() => setReportForm({ ...reportForm, anonymous: !reportForm.anonymous })}
                >
                  <input
                    type="checkbox"
                    checked={reportForm.anonymous}
                    onChange={(e) => setReportForm({ ...reportForm, anonymous: e.target.checked })}
                  />
                  <div className="anonymous-text">
                    <h5>🔒 Report Anonymously (Identity Protected)</h5>
                    <p>Your name and email will be completely concealed from all reports.</p>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-danger-solid"
                >
                  Submit Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: INVESTIGATE & UPDATE STATUS ================= */}
      {showInvestigateModal && selectedIncident && (
        <div className="modal-overlay" onClick={() => setShowInvestigateModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Investigation Findings #{selectedIncident.id}</h3>
              <button className="modal-close" onClick={() => setShowInvestigateModal(false)}>✕</button>
            </div>
            <form onSubmit={handleUpdateInvestigation}>
              <div className="modal-body">
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
                  <strong>{selectedIncident.title}</strong>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                    📍 {selectedIncident.location} | Category: {selectedIncident.category}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Investigation Status *</label>
                  <select
                    className="form-input"
                    value={investigateForm.status}
                    onChange={(e) => setInvestigateForm({ ...investigateForm, status: e.target.value })}
                  >
                    <option value="UNDER_INVESTIGATION">Under Investigation (Hearing / Inspection ongoing)</option>
                    <option value="RESOLVED">Resolved (Disciplinary action or repair completed)</option>
                    <option value="DISMISSED">Dismissed (Unsubstantiated claim)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Official Committee Findings & Action Taken *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Enter official resolution remarks, disciplinary sanctions, repair logs, or committee verdict..."
                    value={investigateForm.remarks}
                    onChange={(e) => setInvestigateForm({ ...investigateForm, remarks: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowInvestigateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Findings & Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ASSIGN FACULTY (ADMIN) ================= */}
      {showAssignModal && selectedIncident && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Investigation Lead #{selectedIncident.id}</h3>
              <button className="modal-close" onClick={() => setShowAssignModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAssignFaculty}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Faculty Committee / Lead *</label>
                  <select
                    className="form-input"
                    value={assignForm.faculty}
                    onChange={(e) => setAssignForm({ ...assignForm, faculty: e.target.value })}
                  >
                    {FACULTY_LIST.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Incident Priority *</label>
                  <select
                    className="form-input"
                    value={assignForm.priority}
                    onChange={(e) => setAssignForm({ ...assignForm, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical Priority</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD STUDENT ================= */}
      {showStudentAddModal && (
        <div className="modal-overlay" onClick={() => setShowStudentAddModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Enroll New Student</h3>
              <button className="modal-close" onClick={() => setShowStudentAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddStudent}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Student Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newStudentForm.name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Student Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={newStudentForm.email}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Course / Branch *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newStudentForm.course}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, course: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowStudentAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Enroll</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DIGITAL ID PASS ================= */}
      {showBadgeModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowBadgeModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Campus Security Gate Pass</h3>
              <button className="modal-close" onClick={() => setShowBadgeModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="badge-preview-card">
                <div className="badge-watermark">🛡️</div>
                <div className="badge-top">
                  <div className="badge-institution">
                    <h4>CAMPUSSHIELD INSTITUTE</h4>
                    <span>Official Student ID & Security Clearance Pass</span>
                  </div>
                </div>
                <div className="badge-profile">
                  <div className="badge-photo">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div className="badge-details">
                    <h3>{selectedStudent.name}</h3>
                    <p><strong>ID:</strong> CS-{1000 + Number(selectedStudent.id)}</p>
                    <p><strong>Email:</strong> {selectedStudent.email}</p>
                    <p><strong>Department:</strong> {selectedStudent.course}</p>
                    <span className="badge-clearance">● LEVEL 1 SECURITY CLEARANCE</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowBadgeModal(false)}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print Pass</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
