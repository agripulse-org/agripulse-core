package com.agripulse.api.service.impl;

import com.agripulse.api.client.gotenberg.GotenbergClient;
import com.agripulse.api.model.exceptions.PdfGenerationException;
import com.agripulse.api.service.PdfGeneratorService;
import com.agripulse.api.service.PdfPageMargin;
import com.agripulse.api.service.PdfPageSize;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class PdfGeneratorServiceImpl implements PdfGeneratorService {

    private static final Logger log = LoggerFactory.getLogger(PdfGeneratorServiceImpl.class);
    private final GotenbergClient gotenbergClient;

    @Override
    public byte[] generateFromHtml(String htmlContent, PdfPageSize pageSize, PdfPageMargin pageMargin) {
        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();

        // Gotenberg's Chromium route requires the HTML file to be named exactly "index.html"
        parts.add("files", new ByteArrayResource(htmlContent.getBytes(StandardCharsets.UTF_8)) {
            @Override
            public String getFilename() {
                return "index.html";
            }
        });

        parts.add("paperWidth",     pageSize.width());
        parts.add("paperHeight",    pageSize.height());
        parts.add("marginTop",      pageMargin.top());
        parts.add("marginBottom",   pageMargin.bottom());
        parts.add("marginLeft",     pageMargin.left());
        parts.add("marginRight",    pageMargin.right());
        parts.add("scale",          "1.0");

        try {
            return gotenbergClient.convertHtmlToPdf(parts);
        } catch (RestClientException e) {
            log.error("Failed to generate PDF via Gotenberg", e);
            throw new PdfGenerationException("Failed to generate PDF: " + e.getMessage(), e);
        }
    }
}
