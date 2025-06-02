package com.example.backendhoatuoiuit.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {

    private int statusCode;

    public CustomException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
