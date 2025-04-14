package com.project.java.repo;

import com.project.java.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {


    List<Project> findByStartDateBetween(Date start, Date end);

    @Query(value = "SELECT * FROM project WHERE name LIKE :keyword", nativeQuery = true)
    List<Project> searchByName(@Param("keyword") String keyword);
    


    List<Project> findAllByOrderByNameAsc();
}
