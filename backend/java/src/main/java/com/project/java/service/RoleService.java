package com.project.java.service;
import com.project.java.model.Role;
import com.project.java.repo.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    public Optional<Role> getRoleById(Integer id) {
        return roleRepository.findById(id);
    }

    public Optional<Role> getRoleByName(String name) {
        return roleRepository.findByName(name);
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Role updateRole(Role role) {
        return roleRepository.save(role);
    }

    @Transactional
    public void deleteRole(Integer id) {
        roleRepository.deleteById(id);
    }

    public List<Role> getRolesByName(String name) {
        return roleRepository.findRolesByName(name);
    }

    public List<Role> getRolesByUserId(Integer userId) {
        return roleRepository.findRolesByUserId(userId);
    }
}
