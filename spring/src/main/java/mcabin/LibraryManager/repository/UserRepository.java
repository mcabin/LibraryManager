package mcabin.LibraryManager.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import mcabin.LibraryManager.entities.User;



public interface UserRepository extends JpaRepository<User,Integer> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
