package com.project.java.service;

import com.project.java.model.Person;
import com.project.java.repo.PersonRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PersonService {

    private final PersonRepository repository;

    public PersonService(PersonRepository repository) {
        this.repository = repository;
    }

    public List<Person> getAll() {
        return repository.findAll();
    }

    public Optional<Person> getById(Long id) {
        return repository.findById(id);
    }

    public Person add(Person person) {
        return repository.save(person);
    }

    public Person update(Long id, Person updated) {
        return repository.findById(id).map(p -> {
            p.setPersonType(updated.getPersonType());
            p.setBirthDate(updated.getBirthDate());
            p.setAddress(updated.getAddress());
            return repository.save(p);
        }).orElse(null);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Person> findByPersonType(String personType) {
        return repository.findByPersonType(personType);
    }

    public List<Person> findByAddressContaining(String address) {
        return repository.findByAddressContaining(address);
    }

    public List<Person> findBornBefore(Date date) {
        return repository.findBornBefore(date);
    }
}
