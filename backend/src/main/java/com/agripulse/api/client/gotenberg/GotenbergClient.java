package com.agripulse.api.client.gotenberg;

import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange
public interface GotenbergClient {

    @PostExchange(value = "/forms/chromium/convert/html", contentType = MediaType.MULTIPART_FORM_DATA_VALUE)
    byte[] convertHtmlToPdf(@RequestBody MultiValueMap<String, Object> parts);
}
