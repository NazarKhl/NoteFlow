package com.project.java.repo;

import com.project.java.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByFileNameContaining(String file_name);
    List<Document> findByFolderId(Long folderId);
    List<Document> findByUserId(Long userId);
    @Query("SELECT d FROM Document d WHERE d.upload_date BETWEEN :start AND :end")
    List<Document> findDocumentsBetweenDates(
        @Param("start") LocalDateTime startDate,
        @Param("end") LocalDateTime endDate);
    
    @Query(value = """
        SELECT file_name, file_path, LENGTH(file_path) as size 
        FROM document 
        ORDER BY size DESC LIMIT 10""", 
        nativeQuery = true)
    List<Object[]> findLargestDocuments();
}
