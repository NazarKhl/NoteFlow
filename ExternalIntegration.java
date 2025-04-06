import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "externalintegration")
public class ExternalIntegration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String api_key;
    private LocalDateTime last_sync;
    private String status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getApi_key() { return api_key; }
    public void setApi_key(String api_key) { this.api_key = api_key; }
    public LocalDateTime getLast_sync() { return last_sync; }
    public void setLast_sync(LocalDateTime last_sync) { this.last_sync = last_sync; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}