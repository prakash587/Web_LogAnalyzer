package com.example.log_analyzer.service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.log_analyzer.shared.LogResponse;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class LogServiceImpl implements LogService {

    @Value("${filePath}")
    String filePath;

    @Value("${threadSize}")
    int threadSize;

    @Override
    public LogResponse getLogs() {
        Map<String, Integer> countryCounts = new ConcurrentHashMap<>();
        Map<String, Integer> osCounts = new ConcurrentHashMap<>();
        Map<String, Integer> browserCounts = new ConcurrentHashMap<>();
        Map<String, Map<String, Integer>> dayAndTimeCounts = new ConcurrentHashMap<>();

        ExecutorService executor = Executors.newFixedThreadPool(threadSize);

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                executor.execute(new ProcessLineTask(line, dayAndTimeCounts, countryCounts, osCounts, browserCounts));
            }
        } catch (IOException e) {
            log.error("Error reading file", e);
        } finally {
            executor.shutdown();
            // Wait for all threads to finish
            try {
                executor.awaitTermination(Long.MAX_VALUE, java.util.concurrent.TimeUnit.NANOSECONDS);
            } catch (InterruptedException e) {
                log.error("Error waiting for executor to terminate", e);
            }
        }

        return new LogResponse(countryCounts, browserCounts, osCounts, dayAndTimeCounts);
    }

    static class ProcessLineTask implements Runnable {
        private final String line;
        private final Map<String, Integer> countryCounts;
        private final Map<String, Map<String, Integer>> dayAndTimeCounts;
        private final Map<String, Integer> osCounts;
        private final Map<String, Integer> browserCounts;

        public ProcessLineTask(String line, Map<String, Map<String, Integer>> dayAndTimeCounts,
                Map<String, Integer> countryCounts,
                Map<String, Integer> osCounts, Map<String, Integer> browserCounts) {
            this.line = line;
            this.dayAndTimeCounts = dayAndTimeCounts;
            this.countryCounts = countryCounts;
            this.osCounts = osCounts;
            this.browserCounts = browserCounts;
        }

        @Override
        public void run() {
            log.info("Running on thread {}", Thread.currentThread());
            // Split the line by commas
            String[] columns = line.split(",");

            String day = columns[3].trim();
            String time = columns[0].trim();

            synchronized (countryCounts) {
                countryCounts.merge(columns[1], 1, Integer::sum);
            }

            synchronized (osCounts) {
                osCounts.merge(columns[4], 1, Integer::sum);
            }

            synchronized (browserCounts) {
                browserCounts.merge(columns[5], 1, Integer::sum);
            }

            synchronized (dayAndTimeCounts) {
                dayAndTimeCounts
                        .computeIfAbsent(day, k -> new ConcurrentHashMap<>())
                        .merge(time, 1, Integer::sum);
            }
        }
    }
}
