package com.project.java.controller;

import com.project.java.model.Role;
import com.project.java.service.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Role createRole(@RequestBody Role role) {
        return roleService.createRole(role);
    }

    @GetMapping("/{id}")
    public Optional<Role> getRoleById(@PathVariable Integer id) {
        return roleService.getRoleById(id);
    }

    @GetMapping
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    @PutMapping("/{id}")
    public Role updateRole(@PathVariable Long id, @RequestBody Role role) {
        role.setId(id);
        return roleService.updateRole(role);
    }

    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable Integer id) {
        roleService.deleteRole(id);
    }

    @GetMapping("/name/{name}")
    public List<Role> getRolesByName(@PathVariable String name) {
        return roleService.getRolesByName(name);
    }

    @GetMapping("/user/{userId}")
    public List<Role> getRolesByUserId(@PathVariable Integer userId) {
        return roleService.getRolesByUserId(userId);
    }
}
