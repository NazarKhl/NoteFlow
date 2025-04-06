import javax.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "analyticsreport")
public class AnalyticsReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String report_type;
    private String data;
    private LocalDateTime generated_at;

    //aktu
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getReport_type() { return report_type; }
    public void setReport_type(String report_type) { this.report_type = report_type; }
    public String getData() { return data; }
    public void setData(String data) { this.data = data; }
    public LocalDateTime getGenerated_at() { return generated_at; }
    public void setGenerated_at(LocalDateTime generated_at) { this.generated_at = generated_at; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}