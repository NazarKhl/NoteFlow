package com.project.java.controller;

import com.project.java.model.Document;
import com.project.java.service.DocumentService;

import io.jsonwebtoken.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Document uploadDocument(@RequestBody Document document) {
        return documentService.uploadDocument(document);
    }

    @GetMapping
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @PutMapping("/{id}")
    public Document updateDocument(@PathVariable Long id, @RequestBody Document document) {
        return documentService.updateDocument(id, document);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
    }

    @GetMapping("/search")
    public List<Document> searchDocuments(@RequestParam String query) {
        return documentService.searchDocuments(query);
    }
    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folderId", required = false) Long folderId,
            @RequestParam(value = "userId", required = false) Long userId
    ) {
        try {
            Document document = new Document();
            document.setFileName(file.getOriginalFilename());
            document.setFileType(file.getContentType());
            document.setFileData(file.getBytes()); 
            document.setUpload_date(LocalDateTime.now());
    
            return new ResponseEntity<>(documentService.save(document), HttpStatus.CREATED);
        } catch (java.io.IOException e) {  
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) {
    Document doc = documentService.getDocumentById(id);

        return ResponseEntity.ok()
            .header("Content-Disposition", "inline; filename=\"" + doc.getFileName() + "\"")
            .header("Content-Type", doc.getFileType())
            .body(doc.getFileData());
    }
}
