package com.agripulse.api.model.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_GATEWAY)
public class WeatherFetchException extends RuntimeException {
    public WeatherFetchException(String message) {
        super(message);
    }
}
