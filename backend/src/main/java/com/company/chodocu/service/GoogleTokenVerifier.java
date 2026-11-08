package com.company.chodocu.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class GoogleTokenVerifier {
    public record GoogleUser(String subject,String email,boolean emailVerified,String name,String picture) {}
    private final GoogleIdTokenVerifier verifier;
    public GoogleTokenVerifier(@Value("${app.google.client-id:}") String clientId){
        verifier=clientId.isBlank()?null:new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),GsonFactory.getDefaultInstance()).setAudience(Collections.singletonList(clientId)).build();
    }
    public GoogleUser xacThuc(String token){
        if(verifier==null) throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE,"Chưa cấu hình đăng nhập Google.");
        try {
            GoogleIdToken idToken=verifier.verify(token);
            if(idToken==null) return null;
            GoogleIdToken.Payload p=idToken.getPayload();
            return new GoogleUser(p.getSubject(),p.getEmail(),Boolean.TRUE.equals(p.getEmailVerified()),
                    (String)p.get("name"),(String)p.get("picture"));
        } catch(Exception ex){ return null; }
    }
}
