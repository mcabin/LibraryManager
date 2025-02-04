package mcabin.LibraryManager.controllers.Response;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mcabin.LibraryManager.entities.Book;
import mcabin.LibraryManager.entities.enums.BookReadState;

@NoArgsConstructor
@Data
@AllArgsConstructor
@Builder
public class BookResponse {
    private String apiId;
    private String title;
    private String author;
    private int readPageNb;
    private BookReadState state;
    private int note;
    private Date date;

    public BookResponse(Book book){
        this.apiId=book.getApiId();
        this.title=book.getTitle();
        this.author=book.getAuthor();
        this.readPageNb=book.getReadPageNb();
        this.state=book.getState();
        this.note=book.getNote();
        this.date=book.getDate();
    }

    public static List<BookResponse> createListOfBookResponse(List<Book> books){
        List<BookResponse> booksResponses=new ArrayList<BookResponse>();
        for (Book book : books) {
            booksResponses.add(new BookResponse(book));
        }
        return booksResponses;
    }
}
