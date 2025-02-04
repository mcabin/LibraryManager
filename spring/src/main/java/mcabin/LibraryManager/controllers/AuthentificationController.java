package mcabin.LibraryManager.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import mcabin.LibraryManager.controllers.Request.AuthenticationRequest;
import mcabin.LibraryManager.controllers.Request.RegisterRequest;
import mcabin.LibraryManager.controllers.Response.AuthenticationResponse;
import mcabin.LibraryManager.service.AuthenticationService;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
public class AuthentificationController {
    private final AuthenticationService service;

    @PostMapping("register")
    public ResponseEntity<AuthenticationResponse> register( @RequestBody RegisterRequest request){
        try{
            return ResponseEntity.ok(service.register(request));
        }
        catch(ResponseStatusException e){
            return ResponseEntity.status(e.getStatusCode()).body(AuthenticationResponse.builder().errorMsg(e.getReason()).token(null).build());
        }
    }

    @PostMapping("login")
    public ResponseEntity<AuthenticationResponse> log(@RequestBody AuthenticationRequest request){
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("refreshToken")
    public ResponseEntity<AuthenticationResponse> refresh(@RequestBody String token){
        try{
            System.out.println(token);
            return ResponseEntity.ok(service.refreshToken(token));
        }
        catch(ResponseStatusException e){
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }
}
