package dev.prometheus.grouping.exception;

public class EmptyListException extends RuntimeException {
    public EmptyListException(String message) {
        super(message);
    }
}