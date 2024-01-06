package com.example.log_analyzer.controller;

import com.example.log_analyzer.service.LogService;
import com.example.log_analyzer.shared.LogResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class LogController {

    private final LogService logService;


    @RequestMapping("/getLogs")
    @CrossOrigin("*")
    public LogResponse getLogs() {
        return logService.getLogs();
    }
}
