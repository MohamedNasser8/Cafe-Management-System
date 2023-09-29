package com.inn.cafe.rest;

import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@RequestMapping("dashboard")
public interface DashboardRest {
    @GetMapping("details")
    ResponseEntity<Map<String,Object>> getCount();

}
