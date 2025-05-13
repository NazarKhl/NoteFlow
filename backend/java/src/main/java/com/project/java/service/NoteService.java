package com.project.java.service;

import com.project.java.model.Note;
import com.project.java.repo.NoteRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class NoteService {
    private final NoteRepository repository;

    public NoteService(NoteRepository repository) {
        this.repository = repository;
    }

    public List<Note> findAll() {
        return repository.findAll();
    }

    public Optional<Note> findById(Long id) {
        return repository.findById(id);
    }

    public Note save(Note note) {
        return repository.save(note);
    }

    public Note update(Long id, Note newNote) {
        return repository.findById(id).map(n -> {
            n.setContent(newNote.getContent());
            return repository.save(n);
        }).orElse(null);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Note> findByCommentKeyword(String kw) {
        return repository.findByCommentKeyword(kw);
    }
}
