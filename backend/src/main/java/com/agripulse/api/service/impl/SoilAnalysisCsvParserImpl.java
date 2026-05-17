package com.agripulse.api.service.impl;

import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.SoilProfile;
import com.agripulse.api.model.enums.SoilDepth;
import com.agripulse.api.model.exceptions.CsvRowLimitExceededException;
import com.agripulse.api.model.value.Concentration;
import com.agripulse.api.model.value.VolumetricWater;
import com.agripulse.api.service.SoilAnalysisCsvParser;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class SoilAnalysisCsvParserImpl implements SoilAnalysisCsvParser {

    private static final int MAX_CSV_ROWS = 10;

    private static final Map<String, SoilDepth> DEPTH_MAP = Map.of(
            "0-5", SoilDepth.DEPTH_0_5,
            "5-15", SoilDepth.DEPTH_5_15,
            "15-30", SoilDepth.DEPTH_15_30,
            "30-60", SoilDepth.DEPTH_30_60
    );

    @Override
    public List<SoilAnalysis> parse(
            MultipartFile file,
            SoilProfile soilProfile
    ) {
        try (
                Reader reader = new InputStreamReader(file.getInputStream());
                CSVParser csvParser = CSVFormat.DEFAULT
                        .builder()
                        .setHeader()
                        .setSkipHeaderRecord(true)
                        .build()
                        .parse(reader)
        ) {
            List<SoilAnalysis> analyses = new ArrayList<>();

            for (CSVRecord record : csvParser) {
                var analysis = parseRecord(record, soilProfile);
                if (analysis == null)
                    continue;

                analyses.add(analysis);

                if (analyses.size() > MAX_CSV_ROWS) {
                    throw new CsvRowLimitExceededException(MAX_CSV_ROWS);
                }
            }

            if (analyses.isEmpty()) {
                throw new RuntimeException("CSV file contains no valid data rows");
            }

            return analyses;

        } catch (CsvRowLimitExceededException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV file", e);
        }
    }

    private SoilAnalysis parseRecord(CSVRecord record, SoilProfile soilProfile) {
        SoilDepth soilDepth = DEPTH_MAP.get(record.get("soilDepth"));
        if (soilDepth == null) {
            return null;
        }

        SoilAnalysis analysis = new SoilAnalysis(soilProfile, soilDepth);

        analysis.setPh(Double.valueOf(record.get("ph")));
        analysis.setNitrogen(new Concentration(Double.parseDouble(record.get("nitrogen"))));
        analysis.setCec(Double.valueOf(record.get("cec")));
        analysis.setOrganicCarbon(new Concentration(Double.parseDouble(record.get("organicCarbon"))));
        analysis.setSandContent(new Concentration(Double.parseDouble(record.get("sandContent"))));
        analysis.setSiltContent(new Concentration(Double.parseDouble(record.get("siltContent"))));
        analysis.setClayContent(new Concentration(Double.parseDouble(record.get("clayContent"))));
        analysis.setBulkDensity(Double.valueOf(record.get("bulkDensity")));
        analysis.setCoarseFragments(new VolumetricWater(Double.parseDouble(record.get("coarseFragments"))));
        analysis.setPlantAvailableWater(new VolumetricWater(Double.parseDouble(record.get("plantAvailableWater"))));

        return analysis;
    }
}
