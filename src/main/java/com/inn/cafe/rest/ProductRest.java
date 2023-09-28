package com.inn.cafe.rest;


import com.inn.cafe.wrapper.ProductWrapper;
import jakarta.persistence.criteria.CriteriaBuilder.In;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("product")
public interface ProductRest {
    @PostMapping("/add")
    ResponseEntity<String> addNewProduct(@RequestBody Map<String,String>requestMap);
    @GetMapping("/get")
    ResponseEntity<List<ProductWrapper>> getAllProducts();

    @PostMapping("/update")
    ResponseEntity<String> updateProduct(@RequestBody Map<String,String>requestMap);

    @DeleteMapping("/delete/{id}")
    ResponseEntity<String> deleteProduct(@PathVariable Integer id);

    @PostMapping("/updateStatus")
    ResponseEntity<String> updateStatus(@RequestBody Map<String,String>requestMap);

    @GetMapping("/getByCategory/{id}")
    ResponseEntity<List<ProductWrapper>> getByCategory(@PathVariable("id") Integer id);

    @GetMapping("/getById/{id}")
    ResponseEntity<ProductWrapper> getByid(@PathVariable("id")Integer id);

}
