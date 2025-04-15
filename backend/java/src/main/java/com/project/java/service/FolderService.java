package com.project.java.service;
import com.project.java.model.Folder;
import com.project.java.model.Project;
import com.project.java.repo.FolderRepository;
import com.project.java.repo.ProjectRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service
public class FolderService {

    private final FolderRepository folderRepository;
    private final ProjectRepository projectRepository;

    public FolderService(FolderRepository folderRepository,
                         ProjectRepository projectRepository) {
        this.folderRepository = folderRepository;
        this.projectRepository = projectRepository;
    }

    public List<Folder> getAllFolders() {
        return folderRepository.findAll();
    }

    public Folder getFolderById(Long id) {
        return folderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Folder not found with id: " + id));
    }

    public Folder saveFolder(Folder folder) {
        if (folder.getProject() == null) {
            throw new IllegalArgumentException("Folder must be linked to a project");
        }
        return folderRepository.save(folder);
    }

    @Transactional
    public void deleteFolder(Long id) {
        Folder folder = folderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Folder not found with id: " + id));
        folderRepository.delete(folder);
    }

    public List<Folder> getFoldersByName(String name) {
        return folderRepository.findByName(name);
    }

    public List<Folder> getFoldersByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found with id: " + projectId));
        return folderRepository.findByProject(project);
    }
}
