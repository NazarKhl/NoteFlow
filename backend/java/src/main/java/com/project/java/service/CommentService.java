package com.project.java.service;


import com.project.java.model.Comment;
import com.project.java.repo.CommentRepository;
import com.project.java.repo.NoteRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    
    private final CommentRepository commentRepository;
     private final NoteRepository noteRepo;

     public CommentService(CommentRepository commentRepo, NoteRepository noteRepo) {
        this.commentRepository = commentRepo;
        this.noteRepo = noteRepo;
    }

    
    @Transactional
    public Comment createComment(Comment comment) {
        comment.setCreated_at(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Comment getCommentById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    @Transactional
    public Comment updateComment(Long id, Comment commentDetails) {
        Comment comment = getCommentById(id);
        comment.setContent(commentDetails.getContent());
        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    public List<Comment> getRecentComments(int days) {
        LocalDateTime date = LocalDateTime.now().minusDays(days);
        return commentRepository.findRecentComments(date);
    }

    public Optional<Comment> addCommentToNote(Long noteId, Comment comment) {
        return noteRepo.findById(noteId).map(note -> {
            comment.setNote(note);
            comment.setCreated_at(LocalDateTime.now());
            return commentRepository.save(comment);
        });
    }
}