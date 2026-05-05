package com.agripulse.api.service;

public interface PdfGeneratorService {

    byte[] generateFromHtml(String htmlContent, PdfPageSize pageSize, PdfPageMargin pageMargin);

    default byte[] generateFromHtml(String htmlContent) {
        return generateFromHtml(htmlContent, PdfPageSize.A4, PdfPageMargin.MINIMAL);
    }
}
