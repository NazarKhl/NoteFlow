package com.project.java.controller;

import com.project.java.model.Project;
import com.project.java.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<Project> getAll() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{id}")
    public Project getById(@PathVariable Long id) {
        // Używamy metody getProjectById z serwisu
        return projectService.getProjectById(id);
    }

    @PostMapping
    public Project create(@RequestBody Project project) {
        return projectService.createProject(project);
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id, @RequestBody Project project) {
        return projectService.updateProject(id, project);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    // Dodatkowe metody jak filtrowanie i sortowanie
    @GetMapping("/sorted")
    public List<Project> sortByName() {
        return projectService.getAllProjects().stream()
                .sorted((p1, p2) -> p1.getName().compareToIgnoreCase(p2.getName()))
                .toList();
    }

    @GetMapping("/filter")
    public List<Project> filterByDate(@RequestParam Date start, @RequestParam Date end) {
        return projectService.getAllProjects().stream()
                .filter(p -> !p.getStartDate().before(start) && !p.getStartDate().after(end))
                .toList();
    }
}
