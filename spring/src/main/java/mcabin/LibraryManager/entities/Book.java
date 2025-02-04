package mcabin.LibraryManager.entities;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mcabin.LibraryManager.entities.enums.BookReadState; 

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Entity
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name="USER_ID")
    private User user;
    private String title;
    private String author;
    private String apiId;
    private int readPageNb;
    private BookReadState state;
    private int note;
    private Date date;
}
