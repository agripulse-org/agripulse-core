package com.agripulse.api.model.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class CsvRowLimitExceededException extends RuntimeException {
    public CsvRowLimitExceededException(int maxRows) {
        super("CSV file exceeds the maximum allowed " + maxRows + " rows");
    }
}