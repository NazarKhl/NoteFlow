package com.project.java.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
@Entity
@Table(name = "project")
@JsonIdentityInfo(
  generator = ObjectIdGenerators.PropertyGenerator.class,
  property = "id",
  scope = Project.class)
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    
    @Temporal(TemporalType.DATE)
    private Date startDate;
    
    @Temporal(TemporalType.DATE)
    private Date endDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIdentityReference(alwaysAsId = true)
    private User user;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Folder> folders = new ArrayList<>();


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Folder> getFolders() { return folders; }
    public void setFolders(List<Folder> folders) { this.folders = folders; }
}
