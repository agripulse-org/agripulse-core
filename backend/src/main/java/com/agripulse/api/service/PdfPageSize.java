package com.agripulse.api.service;

public record PdfPageSize(double width, double height) {
    public static final PdfPageSize A4 = new PdfPageSize(8.27, 11.69);
}