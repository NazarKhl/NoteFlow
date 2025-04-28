package com.project.java.controller;
 import com.project.java.model.Folder;
 import com.project.java.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/folders")
public class FolderController {
    @Autowired
    private FolderService folderService;

    @GetMapping
    public List<Folder> getAll() {
        return folderService.getAllFolders();
    }

    @GetMapping("/{id}")
    public Folder getById(@PathVariable Long id) {
        return folderService.getFolderById(id);
    }

    @PostMapping
    public Folder create(@RequestBody Folder folder) {
        return folderService.saveFolder(folder);
    }

    @PutMapping("/{id}")
    public Folder update(@PathVariable Long id, @RequestBody Folder folder) {
        folder.setId(id);
        return folderService.saveFolder(folder);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        folderService.deleteFolder(id);
    }
}
