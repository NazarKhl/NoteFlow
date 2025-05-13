package com.project.java.controller;

import com.project.java.DTO.FolderDTO;
import com.project.java.service.FolderService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @GetMapping
    public List<FolderDTO> getAll() {
        return folderService.getAllFolders();
    }

    @GetMapping("/{id}")
    public FolderDTO getById(@PathVariable Long id) {
        return folderService.getFolderById(id);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public FolderDTO create(@RequestBody FolderDTO folderDTO) {
        return folderService.saveFolder(folderDTO);
    }

    @PutMapping("/{id}")
    public FolderDTO update(@PathVariable Long id, @RequestBody FolderDTO folderDTO) {
        folderDTO.setId(id);
        return folderService.saveFolder(folderDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        folderService.deleteFolder(id);
    }
}
