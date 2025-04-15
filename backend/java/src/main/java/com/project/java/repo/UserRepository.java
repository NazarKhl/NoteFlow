package com.project.java.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.project.java.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.isActive = :isActive")
    List<User> findByIsActive(Boolean isActive);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> findUsersByRoleName(String roleName);

    @Query(value = "SELECT * FROM User u WHERE u.person_type = :personType", nativeQuery = true)
    List<User> findByPersonType(String personType);
}
