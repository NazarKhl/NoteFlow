package com.project.java.repo;
import com.project.java.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    @Query(value = "SELECT DISTINCT n.* FROM note n " +
            "JOIN comment c ON c.note_id = n.id " +
            "WHERE LOWER(c.content) LIKE LOWER(CONCAT('%', ?1, '%'))", nativeQuery = true)
    List<Note> findByCommentKeyword(String keyword);
}
