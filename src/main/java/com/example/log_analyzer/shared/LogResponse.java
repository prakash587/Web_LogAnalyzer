package com.example.log_analyzer.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.io.Serializable;
import java.util.Map;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class LogResponse implements Serializable {

    private Map<String, Integer> countries;

    private Map<String, Integer> browsers;

    private Map<String, Integer> operatingSystems;

    private Map<String, Map<String, Integer>> dayAndTime;
}
