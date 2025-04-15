package com.project.java.service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.java.model.User;
import com.project.java.repo.UserRepository;

import java.util.List;
import java.util.Optional;
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(int id) {
        userRepository.deleteById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getUsersByActivityStatus(Boolean isActive) {
        return userRepository.findByIsActive(isActive);
    }

    public List<User> getUsersByRole(String roleName) {
        return userRepository.findUsersByRoleName(roleName);
    }

    public List<User> getUsersByPersonType(String personType) {
        return userRepository.findByPersonType(personType);
    }
}
