package com.project.java.service;
import com.project.java.model.Note;
import com.project.java.repo.NoteRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class NoteService {
    private final NoteRepository repo;

    public NoteService(NoteRepository repo) {
        this.repo = repo;
    }

    public List<Note> findAll() {
        return repo.findAll();
    }

    public Optional<Note> findById(Long id) {
        return repo.findById(id);
    }

    public List<Note> findByCommentKeyword(String keyword) {
        return repo.findByCommentKeyword(keyword);
    }

    @Transactional
    public Note save(Note note) {
        return repo.save(note);
    }

    @Transactional
    public Note update(Long id, Note newNote) {
        return repo.findById(id)
                .map(n -> {
                    n.setComments(newNote.getComments());
                    n.setRoles(newNote.getRoles());
                    return repo.save(n);
                }).orElse(null);
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
