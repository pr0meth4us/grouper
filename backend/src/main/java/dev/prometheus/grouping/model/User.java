package dev.prometheus.grouping.model;

import dev.prometheus.grouping.dto.UserList;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.xml.bind.DatatypeConverter;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String password;
    private List<UserList> lists = new ArrayList<>();
    public void setPassword(String password) {
        this.password = encryptSHA256(password);
    }

    public UserList updateListItem(UserList updatedList) {
        String id = updatedList.getListId();

        UserList existingList = lists.stream()
                .filter(list -> list.getListId().equals(id))
                .findFirst()
                .get();

        existingList.setName(updatedList.getName());
        existingList.setItems(new ArrayList<>(updatedList.getItems()));

        return existingList;
    }

    public static String encryptSHA256(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(password.getBytes());
            return DatatypeConverter.printHexBinary(digest).toUpperCase();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error encrypting password", e);
        }
    }

    public boolean verifyPassword(String inputPassword) {
        String encryptedInput = encryptSHA256(inputPassword);
        return this.password.equals(encryptedInput);
    }
}

