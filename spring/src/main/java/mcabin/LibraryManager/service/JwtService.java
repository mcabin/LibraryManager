package mcabin.LibraryManager.service;


import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import mcabin.LibraryManager.entities.User;

@Service
public class JwtService {

    private static final String secretKey="e730366128078fdf06975b725b00fc6b214958a507e4033e19bbe1902f4d2116d3917b2302ddde03b92af2548645a81e8065117c7a7a4c8ff9a779d43b16a569ddc78973d7f7723963465bbd831e74bea58f286e8201a0d71b185586f41efaa7b68c2ac919eb58ad51d7fa25720e9b84ea38470fa4a90b99a35464102b95fdd6a9060a78eb9f03fa30445f7268d27c7d75f359c1dff729e6bc9a952d69fdd69adc637e46a9688852c8b22db5091466f30778162e52eb02a162fe7c969e43cc5b1f6d09a068fe0de41067495a6aa912b9ff44b9f19832df45f6ccf02a5fec11f65565dcf55862f6fb0b5d35f81c656f4a4f062fa8d71f26b818a43af8c2b50084";
    private static final int validityTime=1000*60*20;
    public String extractUsername(String token){
        return extractClaim(token,Claims::getSubject);
    }

  
    private Claims extractAllClaims(String token){
        System.out.println("TOKEN TOKEN YIPPI "+token);
        return Jwts.
        parserBuilder().setSigningKey(getSignedKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
    }

    private Key getSignedKey(){
        byte[] keyBytes=Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    private Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }
    private boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }


    public String generateToken(User userDetails){
        HashMap<String,Object> claims= new HashMap<String,Object>();
        claims.put("id", userDetails.getId());
        claims.put("email",userDetails.getEmail());
        return generateToken(claims,userDetails);
    }

    public String generateToken(Map<String,Object> extraClaims,User userDetails){
        return Jwts.builder()
        .setClaims(extraClaims)
        .setSubject(userDetails.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis()+validityTime))
        .signWith(getSignedKey(),SignatureAlgorithm.HS256).compact();
    }
    public boolean isTokenValid(String token,User userDetails){
        final String username=extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

      public <T> T extractClaim(String token,Function<Claims,T> claimsResolver){
        final Claims claims=extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

}
