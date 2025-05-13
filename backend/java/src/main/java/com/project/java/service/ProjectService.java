package com.project.java.service;

import com.project.java.model.Folder;
import com.project.java.model.Project;
import com.project.java.repo.FolderRepository;
import com.project.java.repo.ProjectRepository;
import com.project.java.repo.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository,
                         FolderRepository folderRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.folderRepository = folderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void deleteProjectWithFolders(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));

        folderRepository.deleteByProject(project);
        projectRepository.delete(project);
    }

    @Transactional
    public Project cloneProjectWithFolders(Long projectId) {
        Project original = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));

        Project clone = new Project();
        clone.setName(original.getName() + " (Copy)");
        clone.setDescription(original.getDescription());
        clone.setStartDate(new Date());
        clone.setUser(original.getUser());

        Project savedClone = projectRepository.save(clone);

        original.getFolders().forEach(originalFolder -> {
            Folder folderClone = new Folder();
            folderClone.setName(originalFolder.getName());
            folderClone.setProject(savedClone);
            folderRepository.save(folderClone);
        });

        return savedClone;
    }

    @Transactional
    public Project createProject(Project project) {
        if (project.getUser() == null || project.getUser().getId() == null) {
            throw new IllegalArgumentException("Project must have an owner with valid ID");
        }
        
        if (!userRepository.existsById(project.getUser().getId())) {
            throw new EntityNotFoundException("User not found with id: " + project.getUser().getId());
        }
        
        return projectRepository.save(project);
    }

    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));
    }

    @Transactional
    public Project updateProject(Long id, Project projectDetails) {
        return projectRepository.findById(id)
                .map(existingProject -> {
                    existingProject.setName(projectDetails.getName());
                    existingProject.setDescription(projectDetails.getDescription());
                    existingProject.setStartDate(projectDetails.getStartDate());
                    existingProject.setEndDate(projectDetails.getEndDate());
                    
                    if (projectDetails.getUser() != null) {
                        existingProject.setUser(projectDetails.getUser());
                    }
                    
                    return projectRepository.save(existingProject);
                })
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + id));
    }
    
    @Transactional
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new EntityNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    public List<Project> getProjectsSortedByName() {
        return projectRepository.findAll()
                .stream()
                .sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
                .toList();
    }

    public List<Project> filterProjectsByDate(Date start, Date end) {
        return projectRepository.findByStartDateBetween(start, end);
    }
}