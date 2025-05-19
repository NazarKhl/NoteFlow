package com.project.java.controller;

import com.project.java.DTO.ProjectDTO;
import com.project.java.model.Project;
import com.project.java.model.User;
import com.project.java.repo.UserRepository;
import com.project.java.service.ProjectService;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;
    private final UserRepository userRepository;

    public ProjectController(ProjectService projectService, UserRepository userRepository) {
        this.projectService = projectService;
        this.userRepository = userRepository;
    }
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Project> getAll() {
        return projectService.getAllProjects();
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public Project getById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> createProject(@RequestBody ProjectDTO projectDTO) {
        Project project = convertToEntity(projectDTO);
        Project createdProject = projectService.createProject(project);
        return ResponseEntity.ok(createdProject);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody ProjectDTO projectDTO) {
        Project project = convertToEntity(projectDTO);
        Project updatedProject = projectService.updateProject(id, project);
        return ResponseEntity.ok(updatedProject);
    }

private Project convertToEntity(ProjectDTO dto) {
    Project project = new Project();
    project.setName(dto.getName());
    project.setDescription(dto.getDescription());
    project.setStartDate(dto.getStartDate());
    project.setEndDate(dto.getEndDate());
    
    if (dto.getUserId() != null) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + dto.getUserId()));
        project.setUser(user);
    } else {
        throw new IllegalArgumentException("User ID must be provided");
    }
    
    return project;
}

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    @GetMapping(value = "/sorted", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Project> sortByName() {
        return projectService.getAllProjects().stream()
                .sorted((p1, p2) -> p1.getName().compareToIgnoreCase(p2.getName()))
                .toList();
    }

    @GetMapping(value = "/filter", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Project> filterByDate(@RequestParam Date start, @RequestParam Date end) {
        return projectService.getAllProjects().stream()
                .filter(p -> !p.getStartDate().before(start) && !p.getStartDate().after(end))
                .toList();
    }
}