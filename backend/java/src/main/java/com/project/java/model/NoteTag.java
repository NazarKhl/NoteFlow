package com.project.java.model;

import java.io.Serializable;

import jakarta.persistence.*;

@Entity
@Table(name = "Note_Tag")
public class NoteTag {
    @EmbeddedId
    private NoteTagId id;

    @ManyToOne
    @MapsId("noteId")
    @JoinColumn(name = "note_id")
    private Note note;

    @ManyToOne
    @MapsId("tagId")
    @JoinColumn(name = "tag_id")
    private Tag tag;

    // Getters and setters
}

@Embeddable
class NoteTagId implements Serializable {
    private Integer noteId;
    private Integer tagId;
    public Integer getNoteId() {
        return noteId;
    }
    public void setNoteId(Integer noteId) {
        this.noteId = noteId;
    }
    public Integer getTagId() {
        return tagId;
    }
    public void setTagId(Integer tagId) {
        this.tagId = tagId;
    }

    
}