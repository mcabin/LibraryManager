package mcabin.LibraryManager.controllers.Response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookRatingResponse {
    private float rating;
    private int userNb;
}
