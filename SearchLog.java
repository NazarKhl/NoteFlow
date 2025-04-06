import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "searchlog")
public class SearchLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String query;
    private Integer results_count;
    private LocalDateTime mensiamp;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
    public Integer getResults_count() { return results_count; }
    public void setResults_count(Integer results_count) { this.results_count = results_count; }
    public LocalDateTime getMensiamp() { return mensiamp; }
    public void setMensiamp(LocalDateTime mensiamp) { this.mensiamp = mensiamp; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}