package com.project.java.repo;

import com.project.java.model.Folder;
import com.project.java.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {

    List<Folder> findByName(String name);

    List<Folder> findByProject(Project project);

    void deleteByProject(Project project);


    @Query("SELECT f FROM Folder f WHERE f.name = :name AND f.project.id = :projectId")
    List<Folder> findByNameAndProjectIdJPQL(String name, Long projectId);
}
