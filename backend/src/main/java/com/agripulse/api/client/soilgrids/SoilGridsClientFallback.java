package com.agripulse.api.client.soilgrids;

import com.agripulse.api.model.exceptions.SoilGridsFetchException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class SoilGridsClientFallback implements SoilGridsClient {

    private static final Logger log = LoggerFactory.getLogger(SoilGridsClientFallback.class);

    @Override
    public SoilGridsResponse getSoilProperties(double lat, double lon, List<String> property, String depth, String value) {
        log.warn("SoilGrids service circuit open, failing fast");
        throw new SoilGridsFetchException("SoilGrids service is temporarily unavailable");
    }
}
