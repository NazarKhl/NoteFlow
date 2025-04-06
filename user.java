import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password_hash;
    private String email;
    private String first_name;
    private String last_name;
    private LocalDateTime created_at;
    private Boolean is_active;
    private Date birth_date;
    private String address;
    private String person_type;

    @OneToMany(mappedBy = "user")
    private List<SearchLog> searchLogs;

    @OneToMany(mappedBy = "user")
    private List<ExternalIntegration> externalIntegrations;

    @OneToMany(mappedBy = "user")
    private List<Comment> comments;

    @OneToMany(mappedBy = "user")
    private List<Force> forces;

    @OneToMany(mappedBy = "user")
    private List<Document> documents;

    @OneToMany(mappedBy = "user")
    private List<AnalyticsReport> analyticsReports;

    @OneToMany(mappedBy = "user")
    private List<Project> projects;

    @OneToMany(mappedBy = "user")
    private List<Role> roles;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword_hash() { return password_hash; }
    public void setPassword_hash(String password_hash) { this.password_hash = password_hash; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFirst_name() { return first_name; }
    public void setFirst_name(String first_name) { this.first_name = first_name; }
    public String getLast_name() { return last_name; }
    public void setLast_name(String last_name) { this.last_name = last_name; }
    public LocalDateTime getCreated_at() { return created_at; }
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; }
    public Boolean getIs_active() { return is_active; }
    public void setIs_active(Boolean is_active) { this.is_active = is_active; }
    public Date getBirth_date() { return birth_date; }
    public void setBirth_date(Date birth_date) { this.birth_date = birth_date; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPerson_type() { return person_type; }
    public void setPerson_type(String person_type) { this.person_type = person_type; }
    public List<SearchLog> getSearchLogs() { return searchLogs; }
    public void setSearchLogs(List<SearchLog> searchLogs) { this.searchLogs = searchLogs; }
    public List<ExternalIntegration> getExternalIntegrations() { return externalIntegrations; }
    public void setExternalIntegrations(List<ExternalIntegration> externalIntegrations) { this.externalIntegrations = externalIntegrations; }
    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }
    public List<Force> getForces() { return forces; }
    public void setForces(List<Force> forces) { this.forces = forces; }
    public List<Document> getDocuments() { return documents; }
    public void setDocuments(List<Document> documents) { this.documents = documents; }
    public List<AnalyticsReport> getAnalyticsReports() { return analyticsReports; }
    public void setAnalyticsReports(List<AnalyticsReport> analyticsReports) { this.analyticsReports = analyticsReports; }
    public List<Project> getProjects() { return projects; }
    public void setProjects(List<Project> projects) { this.projects = projects; }
    public List<Role> getRoles() { return roles; }
    public void setRoles(List<Role> roles) { this.roles = roles; }
}