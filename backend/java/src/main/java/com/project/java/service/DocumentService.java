package com.project.java.service;

import com.project.java.model.Document;
import com.project.java.repo.DocumentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentService {
    
    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }
    

    @Transactional
    public Document uploadDocument(Document document) {
        document.setUpload_date(LocalDateTime.now());
        return documentRepository.save(document);
    }

    public Document save(Document document) {
        return documentRepository.save(document);
    }
    

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    @Transactional
    public Document updateDocument(Long id, Document documentDetails) {
        Document document = getDocumentById(id);
        document.setFileName(documentDetails.getFileName());
        return documentRepository.save(document);
    }

    @Transactional
    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }

    public List<Document> searchDocuments(String query) {
        return documentRepository.findByFileNameContaining(query);
    }
}