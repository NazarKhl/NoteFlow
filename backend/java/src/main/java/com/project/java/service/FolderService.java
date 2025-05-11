package com.project.java.service;

import com.project.java.DTO.FolderDTO;
import com.project.java.model.Folder;
import com.project.java.model.Project;
import com.project.java.repo.FolderRepository;
import com.project.java.repo.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FolderService {

    private final FolderRepository folderRepository;
    private final ProjectRepository projectRepository;

    public FolderService(FolderRepository folderRepository,
                         ProjectRepository projectRepository) {
        this.folderRepository = folderRepository;
        this.projectRepository = projectRepository;
    }

    public List<FolderDTO> getAllFolders() {
        return folderRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public FolderDTO getFolderById(Long id) {
        Folder folder = folderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Folder not found with id: " + id));
        return convertToDTO(folder);
    }

    public FolderDTO saveFolder(FolderDTO folderDTO) {
        Project project = projectRepository.findById(folderDTO.getProjectId())
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + folderDTO.getProjectId()));

        Folder folder = new Folder();
        folder.setId(folderDTO.getId());
        folder.setName(folderDTO.getName());
        folder.setProject(project);

        Folder saved = folderRepository.save(folder);
        return convertToDTO(saved);
    }

    @Transactional
    public void deleteFolder(Long id) {
        Folder folder = folderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Folder not found with id: " + id));
        folderRepository.delete(folder);
    }

    public List<FolderDTO> getFoldersByName(String name) {
        return folderRepository.findByName(name)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FolderDTO> getFoldersByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));
        return folderRepository.findByProject(project)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private FolderDTO convertToDTO(Folder folder) {
        FolderDTO dto = new FolderDTO();
        dto.setId(folder.getId());
        dto.setName(folder.getName());
        dto.setProjectId(folder.getProject().getId());
        return dto;
    }
}
