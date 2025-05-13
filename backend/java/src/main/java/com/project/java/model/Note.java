package com.project.java.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "note")
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;
    
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    @Column(columnDefinition = "TEXT")
    private String content;

    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    @ManyToMany(mappedBy = "notes")
    private List<Role> roles;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) {
        this.comments = comments;
        if (comments != null) {
            comments.forEach(c -> c.setNote(this));
        }
    }

    public List<Role> getRoles() { return roles; }
    public void setRoles(List<Role> roles) { this.roles = roles; }
}
