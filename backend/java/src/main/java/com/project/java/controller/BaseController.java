package com.project.java.controller;
import com.project.java.repo.UserRepository;
import com.project.java.service.BaseService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
public abstract class BaseController<T, ID> {

    protected abstract BaseService<T, ID> getBaseService();

@Autowired
private UserRepository userRepository;

@GetMapping("/me")
public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
    String username = jwt.getSubject();

    Map<String, Object> response = new HashMap<>();
    response.put("username", username);

    userRepository.findByUsername(username).ifPresent(user -> {
        List<String> roles = user.getRoles().stream()
                                 .map(role -> role.getName())
                                 .toList();
        response.put("roles", roles);
    });

    return ResponseEntity.ok(response);
}



    

    @GetMapping
    public ResponseEntity<List<T>> getAll() {
        return ResponseEntity.ok(getBaseService().findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<T> getById(@PathVariable ID id) {
        Optional<T> entity = getBaseService().findById(id);
        return entity.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<T> create(@RequestBody T entity) {
        return ResponseEntity.ok(getBaseService().save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<T> update(@PathVariable ID id, @RequestBody T entity) {
        if (getBaseService().findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(getBaseService().save(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable ID id) {
        if (getBaseService().findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        getBaseService().deleteById(id);
        return ResponseEntity.noContent().build();
    }
}