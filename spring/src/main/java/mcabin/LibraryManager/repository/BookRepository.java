package mcabin.LibraryManager.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import mcabin.LibraryManager.entities.Book;
import mcabin.LibraryManager.entities.User;

public interface BookRepository extends JpaRepository<Book,Integer>{

    List<Book> findByAuthorAndUser(String author,User user);
    List<Book> findByTitleAndUser(String title,User user);
    boolean existsByApiIdAndUser(String apiId,User user);
    Optional<Book> findByApiIdAndUser(String apiId,User user);
    List<Book> findByApiId(String apiId);
    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')) AND b.user = :user")
    List<Book> findByUserAndTitlePartial(String title,User user);
    
    @Query("SELECT b FROM Book b WHERE LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%')) AND b.user = :user")
    List<Book> findByUserAndAuthorPartial(String author,User user);
}
