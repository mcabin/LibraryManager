package mcabin.LibraryManager.controllers.Response;

import lombok.Data;
import lombok.NoArgsConstructor;
import mcabin.LibraryManager.entities.Book;
import mcabin.LibraryManager.entities.enums.BookReadState;
import lombok.AllArgsConstructor;
import lombok.Builder;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRatingResponse {
    private float rating;
    private BookReadState readState;

    public UserRatingResponse(Book book){
        this.rating=book.getNote();
        this.readState=book.getState();
    }
}
