package mcabin.LibraryManager.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import mcabin.LibraryManager.controllers.Request.BookRequest;
import mcabin.LibraryManager.controllers.Response.BookRatingResponse;
import mcabin.LibraryManager.controllers.Response.BookResponse;
import mcabin.LibraryManager.controllers.Response.UserRatingResponse;
import mcabin.LibraryManager.service.BookService;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;




@RestController
@RequestMapping("book")
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;

    @PostMapping("")
    public ResponseEntity<BookResponse> create(@RequestBody BookRequest request) {
        try{
            return ResponseEntity.status(HttpStatus.OK).body(
                new BookResponse(this.bookService.create(request.toBook(), request.getCreatorUsername()))
                );
        }
        catch(ResponseStatusException e){
            return ResponseEntity.status(e.getStatusCode()).body(null); 
        }
    }
    
    @GetMapping(path = "rating/{apiId}")
    public ResponseEntity<BookRatingResponse> getBookRating(@PathVariable String apiId) {
        try{
            return ResponseEntity.status(HttpStatus.OK).body( 
                bookService.getBookRating(apiId));
        }
        catch(ResponseStatusException e){
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    @GetMapping(path = "title/{user}/{title}")
    public ResponseEntity<List<BookResponse>> getBookByTitle(@PathVariable String user,@PathVariable String title) {
        try{
            return ResponseEntity.status(HttpStatus.OK).body( 
                BookResponse.createListOfBookResponse(bookService.getBooksByTitle(title, user)));
        }
        catch(ResponseStatusException e){
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    @GetMapping(path = "author/{user}/{author}")
    public ResponseEntity<List<BookResponse>> getBookByAuthor(@PathVariable String user,@PathVariable String author) {
        try{
            return ResponseEntity.status(HttpStatus.OK).body( 
                BookResponse.createListOfBookResponse(bookService.getBooksByTitle(author, user)));
        }
        catch(ResponseStatusException e){
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    @GetMapping(path = "apiId/{user}/{apiId}")
    public ResponseEntity<BookResponse> getBookByApiId(@PathVariable String user,@PathVariable String apiID) {
        try{
            return ResponseEntity.status(HttpStatus.OK).body(
                new BookResponse(bookService.getBookByApiId(apiID, user)));
        }
        catch(ResponseStatusException e){
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    @GetMapping(path = "titlePartial/{user}/{author}")
    public ResponseEntity<List<BookResponse>> getBookByTitlePartial(@PathVariable String user,@PathVariable String author) {
        try{
            return ResponseEntity.status(HttpStatus.OK).body( 
                BookResponse.createListOfBookResponse(bookService.getBookByPartialTitle(author, user)));
        }
        catch(ResponseStatusException e){
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    @GetMapping(path = "authorPartial/{user}/{author}")
    public ResponseEntity<List<BookResponse>> getBookByAuthorPartial(@PathVariable String user,@PathVariable String author) {
        try{
            return ResponseEntity.status(HttpStatus.OK).body( 
                BookResponse.createListOfBookResponse(bookService.getBookByPartialTitle(author, user)));
        }
        catch(ResponseStatusException e){
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    @GetMapping(path = "userRating/{user}/{apiId}")
    public ResponseEntity<UserRatingResponse> getUserRating(@PathVariable String user,@PathVariable String apiId) {
        try{
            return ResponseEntity.status(HttpStatus.OK).body(
                new UserRatingResponse(bookService.getBookByApiId(apiId, user)));
        }
        catch(ResponseStatusException e){
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }
    
    
}
