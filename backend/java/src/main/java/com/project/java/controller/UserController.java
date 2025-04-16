package com.project.java.controller;

import org.springframework.web.bind.annotation.*;

import com.project.java.model.User;
import com.project.java.service.BaseService;
import com.project.java.service.UserService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController extends BaseController<User, Long> {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable int id) {
        return userService.getUserById(id);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);  
        return userService.updateUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
    }

    @GetMapping("/email/{email}")
    public Optional<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping("/active/{isActive}")
    public List<User> getUsersByActivityStatus(@PathVariable Boolean isActive) {
        return userService.getUsersByActivityStatus(isActive);
    }

    @GetMapping("/role/{roleName}")
    public List<User> getUsersByRole(@PathVariable String roleName) {
        return userService.getUsersByRole(roleName);
    }

    @GetMapping("/person-type/{personType}")
    public List<User> getUsersByPersonType(@PathVariable String personType) {
        return userService.getUsersByPersonType(personType);
    }

    @Override
    protected BaseService<User, Long> getBaseService() {
        return userService;
    }
}
