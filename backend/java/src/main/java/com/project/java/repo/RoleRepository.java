package com.project.java.repo;
import com.project.java.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

    Optional<Role> findByName(String name);

    // JPQL
    @Query("SELECT r FROM Role r WHERE r.name = :name")
    List<Role> findRolesByName(String name);

    // Native SQL
    @Query(value = "SELECT * FROM Role r WHERE r.user_id = :userId", nativeQuery = true)
    List<Role> findRolesByUserId(Integer userId);

    @Query("SELECT r FROM Role r WHERE r.name LIKE %:name%")
    List<Role> findRolesLikeName(String name);
}
