package com.project.java.repo;

import com.project.java.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByContentContaining(String contentFragment);
    
    List<Comment> findByUserId(Long userId);
    
    List<Comment> findByNoteId(Long noteId);
    
    @Query("SELECT c FROM Comment c WHERE c.created_at >= :date")
    List<Comment> findRecentComments(@Param("date") LocalDateTime date);
    
    @Query(value = """
        SELECT u.username, COUNT(c.id) as comment_count 
        FROM users u LEFT JOIN comment c ON u.id = c.user_id 
        GROUP BY u.id""", 
        nativeQuery = true)
    List<Object[]> countCommentsPerUser();
}