package com.project.java.service;
import io.jsonwebtoken.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    private final String SECRET_KEY = "MIICXAIBAAKBgQCd8XaVhZ5Atl87WBN3mKvAXd6vuIATetR0ZHPHr9oV5eo/HP8u" +
            "VbIK+EeSjTuUBQKzObhhFV1kF+09sXimaNbOrs96ytaI6XWVsGV4pcAjMU7PKYWL" +
            "hgmWWd3IZnKXiMslHGKHoGaROoLbSl4LgMXp0pQE0xzl6IBLZohWTqXjiQIDAQAB" +
            "AoGBAI8gaoKy1Cb2XTRM6088pZ+sMQlyG3YLoA1dnmH9pJalg/Hvl/toIvC37zwK" +
            "CkxngfviOYiYsMnsuMtoUNoUNVsndX6f1k1FhtzrULWH4O5hIhVWQXJPCBsEVCxa" +
            "/CJKlLwqXdDfZryB56T9g42q8yW58ECzDjptKT6i+h34ZTeRAkEA1lnHsiUL1MG9" +
            "MbuGum8tU3ywrp5unx5wQYlmRZmZmA82kfg1d4KCqxiEgQMgj/FL51hHSlW28cgk" +
            "5pJf64UUtQJBALyh3YG0CAc9dEPKsoM6I6Gm5jrnoLMhMcZYoW2hK0IvtvA0fDv0" +
            "Lt6S60n/SqiveWHWrS2+XKmjp4+62hhEDAUCQApcjKqv38KJGvwsdHbOqQJAJMpM" +
            "HkzSy9pfKfJzWllfYuPre6orROXAaadS32AV6fVk7w1I128YnbAHo1tfM4ECQCP4" +
            "NbXy74j55f67Wzj80CiWG9blrlYaIVSyN+4gyo/va1H4oCwKjxlwKJ/Op5ztARdw" +
            "CUvsvdy3UU9uEQKJj0UCQFDtumb/uUSCPAaaH52zPYHl5TxlDMD6y6uroshfenVc" +
            "D+BXNLbCCgfHMAjPtFmn1xRZ1TiGaCymQob2iNWlVug=";

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("roles", userDetails.getAuthorities())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24h
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getExpiration()
                .before(new Date());
    }
}
