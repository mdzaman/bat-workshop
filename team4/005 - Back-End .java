// Project Structure
/*
src/main/java/com/vcard/application/
│
├── VCardApplication.java
│
├── config/
│   ├── SecurityConfig.java
│   ├── WebConfig.java
│   └── SwaggerConfig.java
│
├── controller/
│   ├── UserController.java
│   ├── CardController.java
│   └── ShareController.java
│
├── service/
│   ├── UserService.java
│   ├── CardService.java
│   ├── ShareService.java
│   └── JwtService.java
│
├── repository/
│   ├── UserRepository.java
│   ├── CardRepository.java
│   └── ShareLinkRepository.java
│
├── model/
│   ├── User.java
│   ├── VCard.java
│   ├── ShareLink.java
│   └── dto/
│       ├── UserRegistrationDto.java
│       ├── CardCreationDto.java
│       └── ShareLinkDto.java
│
├── security/
│   ├── JwtTokenProvider.java
│   └── UserDetailsServiceImpl.java
│
└── exception/
    ├── GlobalExceptionHandler.java
    ├── UserNotFoundException.java
    └── CardCreationException.java
*/

// Main Application Starter
package com.vcard.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class VCardApplication {
    public static void main(String[] args) {
        SpringApplication.run(VCardApplication.class, args);
    }
}

// User Model
package com.vcard.application.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private LocalDateTime createdAt;
    private List<String> cardIds;
    private boolean enabled;
}

// VCard Model
package com.vcard.application.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "cards")
public class VCard {
    @Id
    private String id;
    private String userId;
    private String title;
    private String jsonDesign;
    private String qrCodeUrl;
    private LocalDateTime createdAt;
    private List<String> socialLinks;
}

// User Repository
package com.vcard.application.repository;

import com.vcard.application.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}

// Card Repository
package com.vcard.application.repository;

import com.vcard.application.model.VCard;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CardRepository extends MongoRepository<VCard, String> {
    List<VCard> findByUserId(String userId);
}

// User Service
package com.vcard.application.service;

import com.vcard.application.model.User;
import com.vcard.application.repository.UserRepository;
import com.vcard.application.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public User registerUser(UserRegistrationDto registrationDto) {
        // Check if user exists
        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new UserAlreadyExistsException("Email already in use");
        }

        // Create new user
        User newUser = new User();
        newUser.setEmail(registrationDto.getEmail());
        newUser.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        newUser.setFirstName(registrationDto.getFirstName());
        newUser.setLastName(registrationDto.getLastName());
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setEnabled(true);

        return userRepository.save(newUser);
    }

    public String loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Validate password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        // Generate JWT token
        return jwtTokenProvider.createToken(email);
    }
}

// Card Service
package com.vcard.application.service;

import com.vcard.application.model.VCard;
import com.vcard.application.repository.CardRepository;
import com.vcard.application.service.storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CardService {
    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private StorageService storageService;

    @Autowired
    private QRCodeGenerator qrCodeGenerator;

    public VCard createCard(CardCreationDto cardDto, String userId) {
        VCard newCard = new VCard();
        newCard.setUserId(userId);
        newCard.setTitle(cardDto.getTitle());
        newCard.setJsonDesign(cardDto.getDesignJson());
        newCard.setCreatedAt(LocalDateTime.now());

        // Generate QR Code
        String qrCodePath = qrCodeGenerator.generateQRCode(newCard);
        String qrCodeUrl = storageService.uploadFile(qrCodePath);
        newCard.setQrCodeUrl(qrCodeUrl);

        return cardRepository.save(newCard);
    }
}

// JWT Token Provider
package com.vcard.application.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;

@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpiration;

    public String createToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
            .setSubject(email)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

// Security Configuration
package com.vcard.application.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
            .antMatchers("/api/auth/**").permitAll()
            .antMatchers("/api/users/**").authenticated()
            .and()
            .httpBasic();

        return http.build();
    }
}

// Application Properties
/*
# application.properties
spring.data.mongodb.uri=mongodb://localhost:27017/vcard
spring.data.mongodb.database=vcard

# JWT Configuration
jwt.secret=yourVerySecretKeyHere
jwt.expiration=86400000 # 24 hours in milliseconds

# AWS S3 Configuration
aws.s3.bucket=vcard-storage
aws.access.key=your-access-key
aws.secret.key=your-secret-key
*/
