package dev.prometheus.grouping.encryption;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class Decoder {
    public static void main(String[] args) {
        // The encoded string you provided
        String encodedString = "6fHJFQrZpTnWkEv3L4mVrV";

        // Decode the string
        String decodedString = decodeBase64(encodedString);

        // Print the decoded string
        System.out.println("Decoded String: " + decodedString);
    }

    // Function to decode a base64-encoded string
    private static String decodeBase64(String encodedString) {
        byte[] decodedBytes = Base64.getUrlDecoder().decode(encodedString);
        return new String(decodedBytes, StandardCharsets.UTF_8);
    }
}

