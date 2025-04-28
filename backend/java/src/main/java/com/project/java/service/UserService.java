package com.project.java.service;

import com.project.java.DTO.AssignUserRolesDto;
import com.project.java.model.User;
import com.project.java.repo.RoleRepository;
import com.project.java.repo.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.Optional;

@Service
public class UserService extends BaseService<User, Long> {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    protected UserRepository getRepository() {
        return userRepository;  
    }

    @Transactional(rollbackOn = Exception.class)
    public User assignRoles(Long id, AssignUserRolesDto assignUserRolesDto) throws Exception {
        if(!id.equals(assignUserRolesDto.getUserId()))
            throw new Exception("The ids do not match");
        var user = userRepository.findById(id).orElseThrow( () -> new Exception(String.format("The user with id {} does not exists", id)));
        for(var role : assignUserRolesDto.getRolesId())
        {
            var roleEntity = roleRepository.findById(role).orElseThrow(() -> new Exception(String.format("The role with {} does not exists", role)));
            user.getRoles().add(roleEntity);
            roleEntity.getUsers().add(user);

            userRepository.save(user);
            roleRepository.save(roleEntity);
        }
        return user;
    }
}