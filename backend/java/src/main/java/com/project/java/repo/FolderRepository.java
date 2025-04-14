package com.project.java.repo;

import com.project.java.model.Folder;
import com.project.java.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {

    List<Folder> findByName(String name);

    List<Folder> findByProject(Project project);


    void deleteByProject(Project project);


}
