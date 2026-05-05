package com.agripulse.api.service;

public record PdfPageMargin(double top, double bottom, double left, double right) {
    public static final PdfPageMargin NORMAL = new PdfPageMargin(1, 1, 1, 1);
    public static final PdfPageMargin MINIMAL = new PdfPageMargin(0.6, 0.6, 0.2, 0.2);
}