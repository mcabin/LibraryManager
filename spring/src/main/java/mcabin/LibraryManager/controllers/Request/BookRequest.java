package mcabin.LibraryManager.controllers.Request;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mcabin.LibraryManager.entities.Book;
import mcabin.LibraryManager.entities.enums.BookReadState;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class BookRequest {
    private String apiId;
    private String title;
    private String author;
    private int readPageNb;
    private BookReadState state;
    private int note;
    private Date date;
    private String creatorUsername;

    public Book toBook(){
        return Book.builder()
        .apiId(apiId)
        .title(title)
        .author(author)
        .readPageNb(readPageNb)
        .state(state)
        .note(note)
        .date(date)
        .build();
    } 
}
