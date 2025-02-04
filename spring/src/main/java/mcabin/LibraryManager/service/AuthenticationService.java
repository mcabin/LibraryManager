package mcabin.LibraryManager.service;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import mcabin.LibraryManager.controllers.Request.AuthenticationRequest;
import mcabin.LibraryManager.controllers.Request.RegisterRequest;
import mcabin.LibraryManager.controllers.Response.AuthenticationResponse;
import mcabin.LibraryManager.entities.User;
import mcabin.LibraryManager.entities.enums.RoleEnum;
import mcabin.LibraryManager.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        
        var user=repository.findByUsername(request.getUsername()).orElseThrow(()->new UsernameNotFoundException("User not found !"));
        var jwtToken=jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public User findByUsername(String username){
        return this.repository.findByUsername(username).orElse(null);
    }

    public User findById(int id){
        return this.repository.findById(id).orElse(null);
    }

    public AuthenticationResponse register(RegisterRequest request) throws ResponseStatusException {
        var user=User.builder()
        .password(passwordEncoder.encode(request.getPassword()))
        .username(request.getUsername()).email(request.getEmail()).
        role(RoleEnum.USER).build();
        if(repository.existsByUsername(user.getUsername())){
            ResponseStatusException e=new ResponseStatusException(HttpStatus.CONFLICT,"Ce nom d'utilisateur est déja utilisé");
            throw e;
        }
        if(repository.existsByEmail(user.getEmail())){
            ResponseStatusException e=new ResponseStatusException(HttpStatus.CONFLICT,"Cette email est déja utilisé");
            throw e;
        }
        repository.save(user);
        System.out.println("User "+user.getUsername());
        var jwtToken=jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse refreshToken(String token) throws ResponseStatusException{
        String username=jwtService.extractUsername(token);
        User user=repository.findByUsername(username).orElse(null);
        if(user!=null){
            if(jwtService.isTokenValid(token, user))
            {
                var newToken=jwtService.generateToken(user);
                return AuthenticationResponse.builder().token(newToken).build();
            }
            else{
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Le token est invalide.");
            }
        }
        else{
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"L'utilisateur n'existe pas.");
        }
    }
    
}