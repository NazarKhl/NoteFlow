package com.project.java.repo;
import com.project.java.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    List<Person> findByPersonType(String personType);
    List<Person> findByAddressContaining(String address);
    @Query(value = "SELECT * FROM person WHERE birth_date < ?1", nativeQuery = true)
    List<Person> findBornBefore(Date date);
}
