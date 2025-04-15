package com.project.java.controller;

import com.project.java.model.User;
import com.project.java.service.BaseService;
import com.project.java.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController extends BaseController<User, Long> {

    @Autowired
    private UserService userService;

    @Override
    protected BaseService<User, Long> getBaseService() {
        return userService;
    }
}
