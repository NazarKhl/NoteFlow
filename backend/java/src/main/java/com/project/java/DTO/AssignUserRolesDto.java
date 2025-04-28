package com.project.java.DTO;

import java.util.List;

public class AssignUserRolesDto {
    private Long userId;

    private List<Integer> rolesId;

    public List<Integer> getRolesId() {
        return rolesId;
    }

    public void setRolesId(List<Integer> rolesId) {
        this.rolesId = rolesId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
