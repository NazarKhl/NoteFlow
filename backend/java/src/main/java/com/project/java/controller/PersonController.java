package com.project.java.controller;
import com.project.java.model.Person;
import com.project.java.service.PersonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
@RestController
@RequestMapping("/api/persons")
public class PersonController {
    private final PersonService service;

    public PersonController(PersonService service) {
        this.service = service;
    }

    @GetMapping
    public List<Person> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Person> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Person create(@RequestBody Person person) {
        return service.add(person);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Person> update(@PathVariable Long id, @RequestBody Person person) {
        Person updated = service.update(id, person);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Custom queries
    @GetMapping("/type/{type}")
    public List<Person> getByType(@PathVariable String type) {
        return service.findByPersonType(type);
    }

    @GetMapping("/address")
    public List<Person> getByAddress(@RequestParam String address) {
        return service.findByAddressContaining(address);
    }

    @GetMapping("/born-before")
    public List<Person> getBornBefore(@RequestParam("date") Date date) {
        return service.findBornBefore(date);
    }
}
