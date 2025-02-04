package mcabin.LibraryManager.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.AllArgsConstructor;
import mcabin.LibraryManager.controllers.Response.BookRatingResponse;
import mcabin.LibraryManager.entities.Book;
import mcabin.LibraryManager.entities.User;
import mcabin.LibraryManager.repository.BookRepository;

@AllArgsConstructor
@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private AuthenticationService authService;

    public Book create(Book book, String username) throws ResponseStatusException {
        // Vérifier que l'objet book n'est pas null
        if (book == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le livre ne peut pas être null");
        }
    
        // Récupérer l'utilisateur
        User user = authService.findByUsername(username);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'utilisateur " + username + " n'existe pas");
        }
    
        // Vérifier si un livre avec le même apiId existe déjà pour cet utilisateur
        Optional<Book> optionalBook = bookRepository.findByApiIdAndUser(book.getApiId(), user);
    
        // Si le livre existe déjà, mettre à jour l'entité existante
        if (optionalBook.isPresent()) {
            Book existingBook = optionalBook.get();
            existingBook.setTitle(book.getTitle()); // Mettre à jour les champs nécessaires
            existingBook.setAuthor(book.getAuthor());
            existingBook.setDate(book.getDate());
            existingBook.setNote(book.getNote());
            existingBook.setState(book.getState());
            // Ajoutez d'autres champs à mettre à jour si nécessaire
            return bookRepository.save(existingBook);
        } else {
            // Si le livre n'existe pas, l'associer à l'utilisateur et le sauvegarder
            book.setUser(user);
            return bookRepository.save(book);
        }
    }

    public List<Book> getBooksByAuthor(String author, String username) throws ResponseStatusException {
        User user = authService.findByUsername(username);
        if (user != null) {
            return this.bookRepository.findByAuthorAndUser(author, user);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'utilisateur " + username + " n'existe pas");
        }
    }

    public List<Book> getBooksByTitle(String title, String username) throws ResponseStatusException {
        User user = authService.findByUsername(username);
        if (user != null) {
            return this.bookRepository.findByTitleAndUser(title, user);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'utilisateur " + username + " n'existe pas");
        }
    }

    public Book getBookByApiId(String apiId, String username) throws ResponseStatusException {
        User user = authService.findByUsername(username);
        if (user != null) {
            return this.bookRepository.findByApiIdAndUser(apiId, user)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Livre introuvable!"));
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'utilisateur " + username + " n'existe pas");
        }
    }

    public List<Book> getBookByPartialTitle(String title, String username) throws ResponseStatusException {
        User user = authService.findByUsername(username);
        if (user != null) {
            return this.bookRepository.findByUserAndTitlePartial(title, user);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'utilisateur " + username + " n'existe pas");
        }
    }

    public List<Book> getBookByPartialAuthor(String title, String username) throws ResponseStatusException {
        User user = authService.findByUsername(username);
        if (user != null) {
            return this.bookRepository.findByUserAndAuthorPartial(title, user);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'utilisateur " + username + " n'existe pas");
        }
    }

    public BookRatingResponse getBookRating(String apiId) throws ResponseStatusException{
        List<Book> books=this.bookRepository.findByApiId(apiId);
        float rating=0;
        int ratingCount=0;
        if(books.size()<=0){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aucun livre trouvé avec l'id: "+apiId );
        }
        for (Book book : books) {
            int currentRating=book.getNote();
            if(currentRating>=0){
                rating+=currentRating;
                ratingCount++;
            }
        }
        return new BookRatingResponse(rating/ratingCount,books.size());
    }
}
