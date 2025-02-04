package mcabin.LibraryManager.controllers.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationRequest {
    private String username;
    private String password;
    
    @Override
    public String toString(){
        return password+" "+username;
    }

    
}